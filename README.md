# Camino

[![CI](https://github.com/UMN-LATIS/Camino/actions/workflows/ci.yml/badge.svg)](https://github.com/UMN-LATIS/Camino/actions/workflows/ci.yml)

> Create and share media-rich educational tours

## Set Up

Camino uses Laravel's docker environment, [Laravel Sail](https://laravel.com/docs/8.x/sail) for development.

You will also need certs for your local dev environment. Recommended install: [mkcert](https://github.com/FiloSottile/mkcert).

To get started:

```sh
# Create a .env file
cp .env.example .env

# Set up local certs with `mkcert`
# Run `mkcert -install` first if this is your first time using mkcert
yarn cert

# Instal php deps
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    laravelsail/php81-composer:latest \
    composer install --ignore-platform-reqs

# Build docker image
# Assuming you have `sail` aliased to `./vendor/bin/sail`
sail build --no-cache

# Start Sail
sail up

# create app key, link storage, etc
sail exec laravel.test ./bin/ci.sh

# migrate the database
sail artisan migrate:fresh --seed

# Install node modules
yarn

# Start in watch or hot module replacement mode
yarn hot

```

## Using the Application

Go to <https://localhost> in your browser.

Login with:

- username: `admin`
- password: `admin`

Additional users can be configured in `config/shibboleth.php`.

Stop the application: `sail down`.

## Deploy

| Enviroment Name | URL                                  |
| --------------- | ------------------------------------ |
| `dev`           | <https://cla-camino-dev.oit.umn.edu> |
| `stage`         | <https://cla-camino-tst.oit.umn.edu> |
| `prod`          | <https://camino.cla.umn.edu>         |

```sh
./vendor/bin/dep deploy <environment name>
```

See: `deploy.php` for environments.
