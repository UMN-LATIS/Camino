<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Stop;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stop', function () {
            Stop::all()->each(function ($stop) {
                if (array_key_exists('subtitle', $stop->stop_content)) {
                    return;
                }

                // update stop_content json, changing stop_content.subtitle to 
                // null
                $stop->stop_content = [
                    ...$stop->stop_content,
                    'subtitle' => NULL
                ];
                $stop->save();
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stop', function (Blueprint $table) {
            //
        });
    }
};
