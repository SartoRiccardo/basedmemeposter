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
    protected function resourceNotFound()
    {
      $resourceName = null;
      if(property_exists($this, "resourceName")) {
        $resourceName = $this->resourceName;
      }
      else {
        $classPath = explode("\\", get_class($this));
        $className = $classPath[count($classPath)-1];
        $resourceName = str_replace("controller", "", strtolower($className));
      }

      return response([
        "errors" => [
            ["title" => "No {$resourceName} found with the given ID"],
          ]
        ], 404);
    }

    /**
     * Craft a response when a validation error occurs
     * @param  ValidationError $error The given error
     * @return \Illuminate\Http\Response
     */
    protected function validationErrorResponse($exception)
    {
      $errors = $exception->errors();
      $response = [];
      foreach ($errors as $field => $fieldErrors) {
        foreach ($fieldErrors as $error) {
          array_push($response, ["title" => $error]);
        }
      }
      return response(["errors" => $response], 400);
    }
}
