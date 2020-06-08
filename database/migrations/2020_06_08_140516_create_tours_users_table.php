<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToursUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tour_user', function (Blueprint $table) {
            $table->bigInteger('tour_id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
        });

        $tours = \App\Tour::all();
        foreach($tours as $tour) {
            DB::table('tour_user')->insert([
                'tour_id' => $tour->id,
                'user_id' => $tour->user_id,
            ]);
        }
        Schema::table("tours", function(Blueprint $table) {
            // $table->dropForeign("tours_user_id_foreign");
            $table->dropColumn("user_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tour_user');
        Schema::table("tours", function(Blueprint $table) {
            $table->bigInteger("user_id")->unsigned();
            $table->foreign("user_id")
                ->references("id")
                ->on("users");
        });
    }
}
