# Camino

> Create and share media-rich educational tours

## Set Up

Camino uses Laravel's docker environment, [Laravel Sail](https://laravel.com/docs/8.x/sail) for development. To get sarted:

```sh
# Create a .env file
cp .env.example .env

# Instal php deps
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    laravelsail/php81-composer:latest \
    composer install --ignore-platform-reqs

# Build docker image
sail build --no-cache

# Create SSL Certs
# You may need to tweak the script in package.json to get your localip address
npm run cert

# Start Sail
sail up

# create app key, link storage, etc
sail exec laravel.test ./bin/ci.sh

# migrate the database
sail artisan migrate:fresh --seed

# Install node modules
npm ci

# Start Laravel Mix to compile Vue
npm run hot

```

The application will be running on <https://localhost>.

## Using the Application

```sh
sail up
npm run watch

# For Hot Module Replacement (HMR), do:
# yarn run dev && yarn run hot
```

Load <http://localhost> in your browser.

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
