<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Start extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("accounts", function(Blueprint $table) {
            $table->id();
            $table->string("username", 30)->unique();
            $table->text("password");
            $table->time("startTime");
            $table->time("finishTime");
        });

        Schema::create("platforms", function(Blueprint $table) {
          $table->string("name", 16);

          $table->primary("name");
        });

        Schema::create("posts", function(Blueprint $table) {
            $table->id();
            $table->string("platform", 16);
            $table->string("originalId", 32);
            $table->date("dateAdded")->default(date("Y-m-d H:i:s"));
            $table->text("originalLink");
            $table->text("thumbnail");

            $table->unique(["platform", "originalId"]);
            $table->foreign("platform")->references("name")->on("platforms");
        });

        Schema::create("schedule", function(Blueprint $table) {
            $table->id();
            $table->dateTime("date");
            $table->unsignedBigInteger("account");
            $table->unsignedBigInteger("post");

            $table->unique(["account", "post"]);
            $table->foreign("account")->references("id")->on("accounts");
            $table->foreign("post")->references("id")->on("posts");
        });

        Schema::create("captions", function(Blueprint $table) {
            $table->id();
            $table->text("text")->unique();
        });

        Schema::create("sources", function(Blueprint $table) {
            $table->id();
            $table->string("name", 32);
            $table->string("platform", 16);

            $table->unique(["name", "platform"]);
            $table->foreign("platform")->references("name")->on("platforms");
        });

        Schema::create("logs", function(Blueprint $table) {
            $table->id();
            $table->dateTime("date")->default(date("Y-m-d H:i:s"));
            $table->string("level", 16);
            $table->unsignedBigInteger("account");
            $table->text("message");

            $table->foreign("account")->references("id")->on("accounts");
        });

        Schema::create("users", function(Blueprint $table) {
            $table->id();
            $table->string("username", 64)->unique();
            $table->string("password");
            $table->string("salt")->unique();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $tables = [
          "salt",
          "users",
          "logs",
          "sources",
          "captions",
          "schedule",
          "posts",
          "platforms",
          "accounts",
        ];
        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
}
