<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// This file is installed at public_html/api/index.php. All secrets and mail code
// live in the sibling arrc-mail directory, outside the public document root.
$privateDirectory = dirname(__DIR__, 2) . '/arrc-mail';
try {
    if (!is_file($privateDirectory . '/bootstrap.php')) {
        throw new RuntimeException('Private backend is not installed.');
    }
    require $privateDirectory . '/bootstrap.php';
    arrc_handle_request($privateDirectory);
} catch (Throwable $error) {
    error_log('ARRC form backend could not start (' . get_class($error) . ').');
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Email delivery is temporarily unavailable. Please email info@arcsecuritysolutions.in.',
        'recipient' => 'info@arcsecuritysolutions.in',
    ]);
}
