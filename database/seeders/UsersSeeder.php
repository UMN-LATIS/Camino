<?php

namespace Database\Seeders;

use App\Tour;
use App\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'latistecharch@umn.edu',
            'unique_id' => 'admin',
        ]);
        $admin->assignRole('super-admin');
    }
}
