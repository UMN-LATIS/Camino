[![CI](https://github.com/UMN-LATIS/Camino/actions/workflows/ci.yml/badge.svg)](https://github.com/UMN-LATIS/Camino/actions/workflows/ci.yml)

# Camino

> Create and share media-rich educational tours

## Introduction

Camino is a free platform for creating and sharing interactive, location-based educational tours with rich media content.

- Sign in: [camino.cla.umn.edu](https://camino.cla.umn.edu)

## Getting Started with Local Development

Prereqs:

- Docker
- NodeJS
- [mkcert](https://github.com/FiloSottile/mkcert) (for local SSL certs)

```sh
# Create a .env file
cp .env.example .env

# Set up local certs with mkcert
# Run `mkcert -install` first if this is your first time using mkcert
npm run cert

# Install php dependencies
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php85-composer:latest \
    composer install --ignore-platform-reqs

# Build docker image
sail build

# Start Sail
sail up

# Setup Laravel
sail artisan key:generate
sail artisan storage:link
chmod -R 777 storage bootstrap/cache
sail artisan config:clear

# Migrate the database
sail artisan migrate:fresh --seed

# Install node modules
npm ci

# Start dev server
npm run dev

# (optional) add laravel boost helpers
sail artisan boost:install
```

## Using the Application

Go to <https://localhost> in your browser.

Login with:

- username: `admin`
- password: `admin`

Additional users can be configured in `config/shibboleth.php`.

Stop the application: `sail down`.

## Deploying

We use [deployer](https://deployer.org/) to deploy to an environment:

```sh
dep deploy <environment>
```

| Environment | URL                                                              |
| ----------- | ---------------------------------------------------------------- |
| dev         | [cla-camino-dev.oit.umn.edu](https://cla-camino-dev.oit.umn.edu) |
| stage       | [cla-camino-tst.oit.umn.edu](https://cla-camino-tst.oit.umn.edu) |
| prod        | [camino.cla.umn.edu](https://camino.cla.umn.edu)                 |

See `deploy.php` for environment configuration.
