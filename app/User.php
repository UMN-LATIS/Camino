<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;
use Auth;

class User extends Authenticatable
{
    use Notifiable;
    use HasRoles;
    use \Lab404\Impersonate\Models\Impersonate;

    protected static function boot()
    {
        parent::boot();

        static::created(function($user) {
            $user->assignRole("user");
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'unique_id', "provider"
    ];

    public function tours() {
        return $this->hasMany(Tour::class);
    }

    public function getAllPermissionsAttribute() {
        $permissions = [];
        foreach (Permission::all() as $permission) {
            if ($this->can($permission->name)) {
                $permissions[] = $permission->name;
            }
        }
        return $permissions;
    }

}
