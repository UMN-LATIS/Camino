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

        // add missing uuids to stages when stop is updated
        static::saving(function ($stop) {
          $stop->addMissingStageIds();
        });
    }

    public function addMissingStageIds() {
      $stages = $this->stop_content['stages'];

      // add uuid to each stage if it doesn't exist
      $stages_with_uuid = collect($stages)->map(function ($stage) {
        return [
          ...$stage,
          'id' => $stage['id'] ?? Str::uuid(),
        ];
      })->toArray();

      // update this stops's stop_content
      $this->stop_content = [
        ...$this->stop_content,
        'stages' => $stages_with_uuid,
      ];    
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
