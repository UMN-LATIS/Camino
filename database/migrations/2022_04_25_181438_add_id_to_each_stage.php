<?php

use App\Stop;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class AddIdToEachStage extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Stop::all()->each(function ($stop) {
      $stop->addMissingStageIds();
      $stop->save();
    });
  }
  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    // remove uuid from all stages
    Stop::all()->each(function ($stop) {
      $stages = $stop->stop_content['stages'];

      $stages_without_uuid = collect($stages)
      ->map(function ($stage) {
        unset($stage['id']);
        return $stage;
      })->toArray();

      // update this stops's stop_content
      $stop->stop_content = [
        ...$stop->stop_content,
        'stages' => $stages_without_uuid,
      ];


      // Note: the Stop model adds uuid() when saving
      // remove the saving hook in the boot() method
      // before rolling back this migration
      $stop->save();
    });

  }
}
