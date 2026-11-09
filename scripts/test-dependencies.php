<?php
// Force an ephemeral test database and key. Never read or mutate a real DB.
putenv('APP_ENV=testing');
putenv('APP_KEY=base64:'.base64_encode(random_bytes(32)));
putenv('DB_CONNECTION=sqlite');
putenv('DATABASE_URL=');
putenv('DB_URL=');
putenv('DB_DATABASE=:memory:');
putenv('CACHE_DRIVER=array');
putenv('SESSION_DRIVER=array');
putenv('MAIL_MAILER=array');
putenv('QUEUE_CONNECTION=sync');
chdir(dirname(__DIR__));
if (file_exists('bootstrap/cache/config.php')) {
    fwrite(STDERR, "Refusing tests with cached application config. Clear it locally first.\n");
    exit(1);
}
$command = escapeshellarg(PHP_BINARY);
if (php_ini_loaded_file()) {
    $command .= ' -c '.escapeshellarg(php_ini_loaded_file());
}
$command .= ' '.escapeshellarg('vendor/bin/phpunit');
passthru($command, $status);
exit($status);
