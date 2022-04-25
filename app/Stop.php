<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

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

    /**
     * returns stages in `stop_content` with new uuids
     * @return Stage[] hash array of stages
     */
    public function cloneStages() {
        return collect($this->stop_content['stages'])
        ->map(function ($stage) {
          return [
          ...$stage,
          'id' => Str::uuid(),
          ];
        })
        ->toArray();
    }

    public function clone() {
      $cloned = new self();
      $cloned->stop_content = [
        ...$this->stop_content,
        'stages' => $this->cloneStages(),
      ];
      return $cloned;
    }
}
