<?php

namespace Deployer;

require 'recipe/laravel.php';
require 'recipe/npm.php';

// Configuration
set('ssh_type', 'native');
set('ssh_multiplexing', true);

set('repository', 'https://github.com/UMN-LATIS/Camino.git');

set('writable_use_sudo', true);
add('shared_files', []);
add('shared_dirs', []);

add('writable_dirs', []);

// Servers

host('dev')
  ->hostname("cla-camino-dev.oit.umn.edu")
  ->user('swadm')
  ->stage('development')
  ->set('bin/php', '/opt/rh/rh-php73/root/usr/bin/php')
  ->set('deploy_path', '/swadm/var/www/html/');

host('stage')
  ->hostname("cla-camino-tst.oit.umn.edu")
  ->user('swadm')
  ->stage('stage')
  ->set('bin/php', '/opt/rh/rh-php73/root/usr/bin/php')
  ->set('deploy_path', '/swadm/var/www/html/');

host('prod')
  ->hostname("cla-camino-prd.oit.umn.edu")
  ->user('swadm')
  ->stage('production')
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
after('npm:install', 'assets:generate');
