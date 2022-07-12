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

    // possible tour language keys
    public const LOCALE_EN = 'English';
    public const LOCALE_ES = "Español";
    public const LOCALE_FR = "Français";

    /**
     * a list of possible tour locales
     */
    public static function possibleLocales()
    {
        return [
            static::LOCALE_EN,
            static::LOCALE_ES,
            static::LOCALE_FR
        ];
    }

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

    public function findAllDeepDives()
    {
        return $this->stops->flatMap(fn (Stop $stop) => $stop->findDeepDives());
    }

    public function findDeepDives(array $listOfDeepDiveIds)
    {
        $allDeepdives = $this->findAllDeepDives();
        $selectedDeepDives = $allDeepdives->filter(
            function ($deepdive) use ($listOfDeepDiveIds) {
                $id = $deepdive['id'];
                return collect($listOfDeepDiveIds)->contains($deepdive['id']);
            }
        );
        return $selectedDeepDives;
    }

    public function newEloquentBuilder($query): SpatialBuilder
    {
        return new SpatialBuilder($query);
    }
}
