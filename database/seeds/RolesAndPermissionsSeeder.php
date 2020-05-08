<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        
        // create permissions
        Permission::create(['name' => 'view unpublished tours']);
        Permission::create(['name' => 'edit own tours']);
        Permission::create(['name' => 'edit all tours']);
        Permission::create(['name' => 'delete own tours']);
        Permission::create(['name' => 'delete any tours']);
        Permission::create(['name' => 'create tours']);
        Permission::create(['name' => 'publish publicly']);
        Permission::create(['name' => 'view all feedback']);
        Permission::create(['name' => 'administer site']);

        // create roles and assign created permissions

        // this can be done as separate statements
        $role = Role::create(['name' => 'user']);
        $role->givePermissionTo(['edit own tours', 'delete own tours','create tours']);

        // or may be done by chaining
        $role = Role::create(['name' => 'administrator'])
            ->givePermissionTo(['view unpublished tours', 'edit all tours', 'delete any tours', 'publish publicly', 'view all feedback', 'administer site']);

        $role = Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());
    }
}
