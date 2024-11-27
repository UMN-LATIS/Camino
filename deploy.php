<?php

namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/yarn.php';

// Configuration
set('ssh_type', 'native');
set('ssh_multiplexing', true);

set('repository', 'https://github.com/UMN-LATIS/Camino.git');

set('writable_use_sudo', true);
add('shared_files', []);
add('shared_dirs', []);

add('writable_dirs', []);

// ignore specific platform requirements like php 7.4 or php 8.1
set('composer_options', '--verbose --prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader --ignore-platform-reqs');

// Servers

host('dev')
    ->set('hostname', 'cla-camino-dev.oit.umn.edu')
    ->set('remote_user', 'swadm')
    ->set('labels', ['stage' => 'development'])
    ->set('bin/php', '/opt/remi/php81/root/usr/bin/php')
    ->set('deploy_path', '/swadm/var/www/html/');

host('stage')
    ->set('hostname', 'cla-camino-tst.oit.umn.edu')
    ->set('remote_user', 'swadm')
    ->set('labels', ['stage' => 'stage'])
    ->set('bin/php', '/opt/remi/php81/root/usr/bin/php')
    ->set('deploy_path', '/swadm/var/www/html/');

host('prod')
    ->set('hostname', 'cla-camino-prd.oit.umn.edu')
    ->set('remote_user', 'swadm')
    ->set('labels', ['stage' => 'production'])
    ->set('bin/php', '/opt/remi/php81/root/usr/bin/php')
    ->set('deploy_path', '/swadm/var/www/html/');

task('assets:generate', function () {
    cd('{{release_path}}');
    run('yarn build');
})->desc('Assets generation');

after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
before('deploy:symlink', 'artisan:migrate');
after('deploy:update_code', 'yarn:install');
after('deploy:shared', 'assets:generate');
