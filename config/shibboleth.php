<?php

return array(

    /*
    |--------------------------------------------------------------------------
    | Views / Endpoints
    |--------------------------------------------------------------------------
    |
    | Set your login page, or login routes, here. If you provide a view,
    | that will be rendered. Otherwise, it will redirect to a route.
    |
     */

    'idp_login'     => '/Shibboleth.sso/Login',
    'idp_logout'    => '/Shibboleth.sso/Logout',
    'authenticated' => '/creator',
    'authfield'     => 'unique_id',
    /*
    |--------------------------------------------------------------------------
    | Emulate an IdP
    |--------------------------------------------------------------------------
    |
    | In case you do not have access to your Shibboleth environment on
    | homestead or your own Vagrant box, you can emulate a Shibboleth
    | environment with the help of Shibalike.
    |
    | Do not use this in production for literally any reason.
    |
     */

    'emulate_idp'       => env('SHIB_EMULATE', false),
    'emulate_idp_users' => array(
        'admin' => array(
            'umnDID'         => 'admin',
            'displayName' => 'Admin User',
            'givenName'   => 'Admin',
            'sn'          => 'User',
            'eppn'        => 'admin@uwm.edu',
        ),
        'staff' => array(
            'umnDID'         => 'staff',
            'displayName' => 'Staff User',
            'givenName'   => 'Staff',
            'sn'          => 'User',
            'eppn'        => 'sith33@mac.com',
        ),
        'user'  => array(
            'umnDID'         => 'user',
            'displayName' => 'User User',
            'givenName'   => 'User',
            'sn'          => 'User',
            'eppn'        => 'cmcfadden@gmail.com',
        ),
    ),

    /*
    |--------------------------------------------------------------------------
    | Server Variable Mapping
    |--------------------------------------------------------------------------
    |
    | Change these to the proper values for your IdP.
    |
     */

    'entitlement' => 'entitlement',

    'user' => [
        // fillable user model attribute => server variable
        'email'       => 'eppn',
        'name'        => 'displayName',
        'unique_id'  => 'umnDID',
    ],

    /*
    |--------------------------------------------------------------------------
    | User Creation and Groups Settings
    |--------------------------------------------------------------------------
    |
    | Allows you to change if / how new users are added
    |
     */

    'add_new_users' => true, // Should new users be added automatically if they do not exist?


);
