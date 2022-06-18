#!/usr/bin/env bash

# Generate Key
php artisan key:generate

# Directory Permissions
php artisan storage:link
chmod -R 777 ./storage
chmod -R 777 ./bootstrap/cache
php artisan config:clear

php artisan migrate:fresh --seed

# Fix Ownership
chown -R 1000:1000 storage
