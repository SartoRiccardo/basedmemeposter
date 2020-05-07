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
      $resourceName = null;
      if(property_exists($this, "resourceName")) {
        $resourceName = $this->resourceName;
      }
      else {
        $classPath = explode("\\", get_class($this));
        $className = $classPath[count($classPath)-1];
        $resourceName = str_replace("Controller", "", strtolower($className));
      }

      return response([
        "errors" => [
            ["title" => "No {$resourceName} found with the given ID"],
          ]
        ], 404);
    }
}
