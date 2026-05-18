<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports GD Library, Imagick, and Vips. We pin
    | this to Imagick because that's what our RHEL hosts install via
    | ansible (php_packages_extra: php{version}-php-pecl-imagick-im7).
    | Override per-environment with IMAGE_DRIVER if needed.
    |
    */

    'driver' => env('IMAGE_DRIVER', \Intervention\Image\Drivers\Imagick\Driver::class),

    /*
    |--------------------------------------------------------------------------
    | Configuration Options
    |--------------------------------------------------------------------------
    */

    'options' => [
        'autoOrientation' => true,
        'decodeAnimation' => true,
        'blendingColor' => 'ffffff',
        'strip' => false,
    ],

];
