#!/usr/bin/env bash

# Generate Key
php artisan key:generate

# Directory Permissions
php artisan storage:link
chown -R 1000:1000 storage
chown -R 1000:1000 bootstrap/cache
chmod -R 777 ./storage
chmod -R 777 ./bootstrap/cache
php artisan config:clear

php artisan migrate:fresh --seed
