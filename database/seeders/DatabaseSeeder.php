<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\User;
use App\Tour;

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
            RolesAndPermissionsSeeder::class,
            UsersSeeder::class,
        ]);


        // create some default tours owned by admin
        $admin = User::where('unique_id', 'admin')->first();

        $tourSeeders = [
            DefaultTourSeeder::class,
            StoneArchTourSeeder::class,
            ChromaZoneTourSeeder::class,
        ];

        $this->call($tourSeeders);

        Tour::latest()
            ->take(count($tourSeeders))
            ->each(function ($tour) use ($admin) {
                $admin->tours()->attach($tour);
            });
    }
}
