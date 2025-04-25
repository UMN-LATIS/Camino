<?php

namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/npm.php';
// Configuration
set('ssh_type', 'native');
set('ssh_multiplexing', true);

set('repository', 'https://github.com/UMN-LATIS/Camino.git');

// set('writable_use_sudo', true);
add('shared_files', []);
add('shared_dirs', []);

add('writable_dirs', []);

// ignore specific platform requirements like php 7.4 or php 8.1
set('composer_options', '--verbose --prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader --ignore-platform-reqs');

// Servers

// Servers
$devHost = 'cla-camino-r9-dev.oit.umn.edu';
$stageHost = 'cla-camino-r9-tst.oit.umn.edu';
$prodHost = 'cla-camino-r9-prd.oit.umn.edu';


host('dev')
    ->set('hostname', $devHost)
    ->set('remote_user', 'latis_deploy')
    ->set('labels', ['stage' => 'development'])
    // ->identityFile()
    ->set('deploy_path', '/var/www/camino/');

host('stage')
    ->set('hostname', $stageHost)
    ->set('remote_user', 'latis_deploy')
    ->set('labels', ['stage' => 'stage'])
    ->set('deploy_path', '/var/www/camino/');


host('prod')
    ->set('hostname', $prodHost)
    ->set('remote_user', 'latis_deploy')
    ->set('labels', ['stage' => 'production'])
    ->set('deploy_path', '/var/www/camino/');

task('assets:generate', function () {
    cd('{{release_path}}');
    run('npm run build');
})->desc('Assets generation');

after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
before('deploy:symlink', 'artisan:migrate');
after('deploy:update_code', 'npm:install');
after('deploy:shared', 'assets:generate');
