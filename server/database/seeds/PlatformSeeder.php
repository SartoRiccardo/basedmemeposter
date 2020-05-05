<?php

use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $platforms = [
          ["name" => "instagram"],
          ["name" => "twitter"],
          ["name" => "reddit"],
          ["name" => "imgur"],
        ];

        foreach ($platforms as $platform) {
          DB::table("platforms")->insert($platform);
        }
    }
}
