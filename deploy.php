<?php

namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/npm.php';

// Configuration
set('ssh_type', 'native');
set('ssh_multiplexing', true);

set('repository', 'https://github.com/UMN-LATIS/Camino.git');

set('writable_use_sudo', true);
add('shared_files', []);
add('shared_dirs', []);

add('writable_dirs', []);

// ignore specific platform requirements like php 7.4 or php 8.1
set('composer_options', '{{composer_action}} --verbose --prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader --ignore-platform-reqs');

// Servers

host('cla-camino-dev.oit.umn.edu')
  ->alias("dev")
  ->remote_user('swadm')
  ->set('labels', ['stage' => 'development'])
  ->set('bin/php', '/opt/remi/php81/root/usr/bin/php')
  ->set('deploy_path', '/swadm/var/www/html/');

host('cla-camino-tst.oit.umn.edu')
  ->alias("stage")
  ->remote_user('swadm')
  ->set('labels', ['stage' => 'stage'])
  ->set('bin/php', '/opt/rh/rh-php73/root/usr/bin/php')
  ->set('deploy_path', '/swadm/var/www/html/');

host('cla-camino-prd.oit.umn.edu')
  ->alias("prod")
  ->remote_user('swadm')
  ->set('labels', ['stage' => 'production'])
  ->set('bin/php', '/opt/rh/rh-php73/root/usr/bin/php')
  ->set('deploy_path', '/swadm/var/www/html/');

task('assets:generate', function () {
  cd('{{release_path}}');
  run('npm run production');
})->desc('Assets generation');

task('fix_storage_perms', '
    touch storage/logs/laravel.log
    sudo chown apache storage/logs/laravel.log
    sudo chgrp apache storage/logs/laravel.log
')->desc("Fix Apache Logs");
after('artisan:migrate', 'fix_storage_perms');


after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
before('deploy:symlink', 'artisan:migrate');
after('deploy:update_code', 'npm:install');
after('deploy:shared', 'assets:generate');
