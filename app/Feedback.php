<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{

    public $fillable = ["email", "name", "feedback"];

    public function tour() {
        return $this->belongsTo(Tour::class);
    }

    public function getCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d H:i');
    }
}
