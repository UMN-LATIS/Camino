<?php

// howto search within a distance of a point: \App\Tour::distanceSphere("start_location", new Point( "44.9282", "-93.1463" ), 10)->get();

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use MatanYadaev\EloquentSpatial\SpatialBuilder;
use MatanYadaev\EloquentSpatial\Objects\Point;

class Tour extends Model
{
    use SoftDeletes;

    protected $spatialFields = [
        'start_location'
    ];

    protected $fillable = [
        "public",
        "active",
        "title",
        "tour_content",
        "start_location",
        "driving",
        "biking",
        "walking",
        "style"
    ];

    protected $casts = [
        'tour_content' => 'json',
        'geocoded' => 'json',
        'walking' => 'boolean',
        'biking' => 'boolean',
        'driving' => 'boolean',
        'public' => 'boolean',
        'active' => 'boolean',
        'start_location' => Point::class,
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function stops()
    {
        return $this->hasMany(Stop::class);
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function newEloquentBuilder($query): SpatialBuilder
    {
        return new SpatialBuilder($query);
    }
}
