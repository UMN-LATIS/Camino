<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BikeWalkDriveChangeTour extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("tours", function(Blueprint $table) {
            $table->dropColumn("transport_type");
            $table->boolean("driving")->default(false);
            $table->boolean("biking")->default(false);
            $table->boolean("walking")->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("tours", function(Blueprint $table) {
            $table->integer("transport_type")->default(0);
            $table->dropColumn("driving");
            $table->dropColumn("biking");
            $table->dropColumn("walking");
        });
    }
}
