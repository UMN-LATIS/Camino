<?php

use Database\Seeders\DefaultTourSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Database\Seeder;
use Spatie\Permission\Contracts\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            // UsersTableSeeder::class,
            RolesAndPermissionsSeeder::class,
            DefaultTourSeeder::class
        ]);
    }
}
