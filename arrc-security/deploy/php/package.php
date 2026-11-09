<?php
declare(strict_types=1);

$root = realpath($argv[1]);
if (!$root || !is_dir($root . '/public_html/api') || !is_dir($root . '/arrc-mail')) {
    throw new RuntimeException('Invalid shared-hosting staging directory.');
}
$archive = new ZipArchive();
if ($archive->open($argv[2], ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    throw new RuntimeException('Could not create the hosting archive.');
}
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
foreach ($files as $file) {
    if (!$file->isFile() || $file->isLink()) {
        continue;
    }
    $name = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));
    if ($file->getFilename() === '.env' || $file->getFilename() === '.env.local') {
        throw new RuntimeException('Refusing to package private credentials.');
    }
    if (!$archive->addFile($file->getPathname(), $name)) {
        throw new RuntimeException('Could not add a hosting file.');
    }
}
if (!$archive->close()) {
    throw new RuntimeException('Could not finish the hosting archive.');
}
echo "Shared-hosting archive created with public files and the private PHP backend.\n";
