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
        Schema::table('stop', function (Blueprint $table) {
            Stop::all()->each(function ($stop) {
                if (isset($stop->stop_content['subtitle'])) {
                    return;
                }

                // add an empty {} LocalizedText object
                $stop->stop_content = [
                    ...$stop->stop_content,
                    'subtitle' => NULL,
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
