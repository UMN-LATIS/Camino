<?php

// howto search within a distance of a point: \App\Tour::distanceSphere("start_location", new Point( "44.9282", "-93.1463" ), 10)->get();

namespace App;

use Illuminate\Database\Eloquent\Model;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tour extends Model
{
    Use SoftDeletes;
    use SpatialTrait;

    protected $spatialFields = [
        'start_location'
    ];

    protected $fillable = ["public", "active", "title", "tour_content", "start_location", "transport_type"];

    protected $casts = [
        'tour_content' => 'json',
        'geocoded' => 'json'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function stops() {
        return $this->hasMany(Stop::class);
    }
        
    public function feedback() {
        return $this->hasMany(Feedback::class);
    }
}
