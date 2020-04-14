<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Stop extends Model
{
    Use SoftDeletes;

    public $fillable = ["tour_id", "stop_content", "sort_order"];
    protected $casts = [
        'stop_content' => 'json',
    ];


    public function tour() {
        return $this->belongsTo(Tour::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('sort_order', 'asc');
        });
    }

}
