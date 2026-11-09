<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

final class ArrcRequestError extends RuntimeException
{
    public function __construct(public int $status, string $message)
    {
        parent::__construct($message);
    }
}

function arrc_environment(string $directory): array
{
    $file = $directory . '/.env';
    $env = is_file($file) ? @parse_ini_file($file, false, INI_SCANNER_RAW) : [];
    if ($env === false) {
        throw new RuntimeException('Invalid private mail configuration.');
    }
    foreach (['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO', 'SITE_URL', 'TRUST_PROXY'] as $key) {
        $value = getenv($key);
        if ($value !== false) {
            $env[$key] = $value;
        }
    }
    return $env;
}

function arrc_text(array $data, string $key, string $label, int $min = 0, int $max = 300): string
{
    $value = $data[$key] ?? '';
    if (!is_string($value)) {
        throw new ArrcRequestError(422, 'Enter a valid ' . $label . '.');
    }
    $value = trim($value);
    $length = preg_match_all('/./us', $value);
    if ($length === false || $length < $min || $length > $max) {
        throw new ArrcRequestError(422, 'Enter a valid ' . $label . ' (' . $min . '–' . $max . ' characters).');
    }
    return $value;
}

function arrc_contact_details(array $data): array
{
    $name = arrc_text($data, 'fullName', 'full name', 2, 100);
    $email = arrc_text($data, 'email', 'email address', 1, 254);
    $phone = arrc_text($data, 'phone', 'phone number', 10, 40);
    $digits = strlen(preg_replace('/\D/', '', $phone));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new ArrcRequestError(422, 'Enter a valid email address.');
    }
    if (!preg_match('/^[+\d\s()\-]+$/', $phone) || $digits < 10 || $digits > 15) {
        throw new ArrcRequestError(422, 'Enter a valid phone number with 10–15 digits.');
    }
    return [$name, $email, $phone];
}

function arrc_inquiry(array $catalogue): array
{
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        throw new ArrcRequestError(415, 'Submit enquiries as JSON.');
    }
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if ($raw === false || strlen($raw) > 65536) {
        throw new ArrcRequestError(413, 'This submission is too large.');
    }
    try {
        $object = json_decode($raw, false, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        throw new ArrcRequestError(400, 'The enquiry could not be read.');
    }
    if (!is_object($object)) {
        throw new ArrcRequestError(400, 'Submit a valid enquiry.');
    }
    $data = (array) $object;
    $formType = $data['formType'] ?? 'contact';
    if (!in_array($formType, ['contact', 'quote'], true)) {
        throw new ArrcRequestError(422, 'Choose a valid enquiry type.');
    }
    [$name, $email, $phone] = arrc_contact_details($data);
    $company = arrc_text($data, 'companyName', 'company name', 2, 150);
    $service = arrc_text($data, 'service', 'service', 1, 100);
    $title = $catalogue['services'][$service] ?? null;
    if (!$title) {
        throw new ArrcRequestError(422, 'Choose a service.');
    }
    $message = arrc_text($data, 'message', 'requirements', 20, 3000);
    if (($data['consent'] ?? null) !== true) {
        throw new ArrcRequestError(422, 'Please agree to be contacted about this enquiry.');
    }
    $lines = ['Hello ARRC team,', '', 'Website ' . $formType . ' submission', '', 'Name: ' . $name, 'Company: ' . $company, 'Email: ' . $email, 'Phone: ' . $phone, 'Service: ' . $title];
    if ($formType === 'quote') {
        $lines[] = 'Property type: ' . arrc_text($data, 'propertyType', 'property type', 1, 200);
        $lines[] = 'Location: ' . arrc_text($data, 'location', 'site location', 2, 200);
        $personnel = arrc_text($data, 'personnel', 'personnel count', 0, 5);
        if ($personnel !== '' && (!ctype_digit($personnel) || (int) $personnel < 1 || (int) $personnel > 10000)) {
            throw new ArrcRequestError(422, 'Enter a number between 1 and 10,000, or leave this blank.');
        }
        if ($personnel !== '') {
            $lines[] = 'Personnel required: ' . $personnel;
        }
    }
    $lines[] = '';
    $lines[] = 'Requirements:';
    $lines[] = $message;
    return ['replyTo' => $email, 'subject' => 'Website ' . ($formType === 'quote' ? 'quote request' : 'enquiry') . ' — ' . $title, 'text' => implode("\n", $lines)];
}

function arrc_application(array $catalogue): array
{
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'multipart/form-data;')) {
        throw new ArrcRequestError(415, 'Submit applications with a resume attachment.');
    }
    $data = $_POST;
    $category = arrc_text($data, 'category', 'application category', 1, 30);
    $team = $catalogue['careers'][$category] ?? null;
    $role = arrc_text($data, 'designation', 'job role', 1, 150);
    if (!$team || !in_array($role, $team['roles'], true)) {
        throw new ArrcRequestError(422, 'Choose a valid role for this application category.');
    }
    [$name, $email, $phone] = arrc_contact_details($data);
    if (($data['consent'] ?? null) !== 'true') {
        throw new ArrcRequestError(422, 'Please agree to be contacted about your application.');
    }
    $resume = $_FILES['resume'] ?? null;
    if (!is_array($resume) || !isset($resume['error']) || !is_int($resume['error'])) {
        throw new ArrcRequestError(422, 'Choose one PDF, DOC or DOCX resume.');
    }
    if (in_array($resume['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
        throw new ArrcRequestError(413, 'Your resume must be 5 MB or smaller.');
    }
    if ($resume['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($resume['tmp_name'])) {
        throw new ArrcRequestError(422, 'Choose one PDF, DOC or DOCX resume.');
    }
    if ($resume['size'] < 1 || $resume['size'] > 5 * 1024 * 1024) {
        throw new ArrcRequestError(422, 'Your resume must be non-empty and 5 MB or smaller.');
    }
    $extension = strtolower(pathinfo($resume['name'], PATHINFO_EXTENSION));
    $allowed = [
        'pdf' => ['application/pdf'],
        'doc' => ['application/msword', 'application/octet-stream', 'application/x-ole-storage', 'application/cdfv2'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
    ];
    $mime = strtolower((new finfo(FILEINFO_MIME_TYPE))->file($resume['tmp_name']));
    if (!isset($allowed[$extension]) || !in_array($mime, $allowed[$extension], true)) {
        throw new ArrcRequestError(422, 'Choose a PDF, DOC or DOCX resume.');
    }
    $filename = substr(preg_replace('/[\\\\\/:\x00-\x1f\x7f]/', '_', $resume['name']), -180);
    $lines = ['Hello ARRC team,', '', 'Career application: ' . $role, 'Application category: ' . $team['title'], '', 'Name: ' . $name, 'Email: ' . $email, 'Phone: ' . $phone];
    foreach (['address' => ['Address', 300], 'currentLocation' => ['Current location', 150], 'experience' => ['Experience', 100], 'lastSalary' => ['Last salary', 100], 'lastPost' => ['Last position / employer', 150]] as $key => [$label, $limit]) {
        $value = arrc_text($data, $key, strtolower($label), 0, $limit);
        if ($value !== '') {
            $lines[] = $label . ': ' . $value;
        }
    }
    $lines[] = 'Resume attached: ' . $filename;
    return ['replyTo' => $email, 'subject' => 'Career application — ' . $role, 'text' => implode("\n", $lines), 'attachment' => ['path' => $resume['tmp_name'], 'filename' => $filename, 'mime' => $mime]];
}

function arrc_limit_attempts(string $directory, array $env): void
{
    $runtime = $directory . '/runtime';
    if (!is_dir($runtime) && !@mkdir($runtime, 0700, true) && !is_dir($runtime)) {
        throw new RuntimeException('Cannot create private rate-limit directory.');
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (($env['TRUST_PROXY'] ?? '') === 'true') {
        $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $ip)[0]);
    }
    $file = @fopen($runtime . '/' . hash('sha256', $ip) . '.json', 'c+');
    if (!$file) {
        throw new RuntimeException('Cannot access private rate-limit storage.');
    }
    try {
        if (!flock($file, LOCK_EX)) {
            throw new RuntimeException('Cannot lock rate-limit storage.');
        }
        $attempt = json_decode(stream_get_contents($file), true);
        $now = time();
        if (!is_array($attempt) || ($attempt['expires'] ?? 0) <= $now) {
            $attempt = ['count' => 0, 'expires' => $now + 900];
        }
        $attempt['count']++;
        ftruncate($file, 0);
        rewind($file);
        fwrite($file, json_encode($attempt));
        fflush($file);
        if ($attempt['count'] > 10) {
            header('Retry-After: ' . max(1, $attempt['expires'] - $now));
            throw new ArrcRequestError(429, 'Too many submissions. Please try again later or email us.');
        }
    } finally {
        fclose($file);
    }
}

function arrc_send_mail(string $directory, array $env, string $recipient, array $message): void
{
    foreach (['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as $key) {
        if (trim($env[$key] ?? '') === '') {
            throw new ArrcRequestError(503, 'Email delivery is temporarily unavailable. Please email ' . $recipient . '.');
        }
    }
    require_once $directory . '/vendor/autoload.php';
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = trim($env['SMTP_HOST']);
    $port = filter_var($env['SMTP_PORT'] ?? '587', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
    if ($port === false) {
        throw new RuntimeException('Invalid SMTP port.');
    }
    $secure = isset($env['SMTP_SECURE']) ? $env['SMTP_SECURE'] === 'true' : $port === 465;
    $mail->Port = $port;
    $mail->SMTPSecure = $secure ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAuth = true;
    $mail->Username = trim($env['SMTP_USER']);
    $mail->Password = strtolower($mail->Host) === 'smtp.gmail.com' ? preg_replace('/\s+/', '', $env['SMTP_PASS']) : $env['SMTP_PASS'];
    $mail->Timeout = 15;
    $mail->Timelimit = 20;
    $mail->SMTPDebug = 0;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom(trim($env['SMTP_FROM'] ?? '') ?: $mail->Username, 'ARRC website');
    $mail->addAddress($recipient);
    $mail->addReplyTo($message['replyTo']);
    $mail->Subject = $message['subject'];
    $mail->Body = $message['text'];
    if (isset($message['attachment'])) {
        $attachment = $message['attachment'];
        $mail->addAttachment($attachment['path'], $attachment['filename'], PHPMailer::ENCODING_BASE64, $attachment['mime']);
    }
    if (!$mail->send()) {
        throw new RuntimeException('SMTP did not accept the message.');
    }
}

function arrc_handle_request(string $directory): void
{
    $recipient = 'info@arcsecuritysolutions.in';
    try {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        if (!in_array($path, ['/api/enquiry', '/api/careers'], true)) {
            throw new ArrcRequestError(404, 'This endpoint does not exist.');
        }
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            header('Allow: POST');
            throw new ArrcRequestError(405, 'Use POST to submit a form.');
        }
        $env = arrc_environment($directory);
        $recipient = trim($env['SMTP_TO'] ?? '') ?: $recipient;
        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid recipient configuration.');
        }
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $siteUrl = rtrim($env['SITE_URL'] ?? '', '/');
        $originParts = parse_url($origin);
        $originHost = ($originParts['host'] ?? '') . (isset($originParts['port']) ? ':' . $originParts['port'] : '');
        if ($origin !== '' && $origin !== $siteUrl && $originHost !== ($_SERVER['HTTP_HOST'] ?? '')) {
            throw new ArrcRequestError(403, 'Submit this form from our website.');
        }
        arrc_limit_attempts($directory, $env);
        $limit = $path === '/api/careers' ? 5 * 1024 * 1024 + 65536 : 65536;
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > $limit) {
            throw new ArrcRequestError(413, 'This submission is too large.');
        }
        $catalogue = json_decode(file_get_contents($directory . '/form-data.json'), true, 32, JSON_THROW_ON_ERROR);
        $message = $path === '/api/careers' ? arrc_application($catalogue) : arrc_inquiry($catalogue);
        arrc_send_mail($directory, $env, $recipient, $message);
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Your message was accepted by our mail server.']);
    } catch (Throwable $error) {
        $status = $error instanceof ArrcRequestError ? $error->status : 502;
        if (!$error instanceof ArrcRequestError) {
            error_log('ARRC website mail delivery failed (' . get_class($error) . ').');
        }
        http_response_code($status);
        echo json_encode(['success' => false, 'message' => $error instanceof ArrcRequestError ? $error->getMessage() : 'Your message could not be sent. Please email ' . $recipient . '.', 'recipient' => $recipient]);
    }
}
