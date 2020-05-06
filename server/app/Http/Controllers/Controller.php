<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Craft a response for when a resource is not found.
     *
     * @return \Illuminate\Http\Response
     */
    protected function resourceNotFound() {
      return response([
        "errors" => [
            ["title" => "No {$this->resourceName} found with the given ID"],
          ]
        ], 404);
    }
}
