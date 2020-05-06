<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

function Resource($router, $path, $controller)
{
    $pathSingular = substr($path, 0, strlen($path)-1);

    $router->get("/$path", "{$controller}@index");
    $router->get("/$path/{{$pathSingular}}", "{$controller}@show");
    $router->post("/$path", "{$controller}@store");
    $router->put("/$path/{{$pathSingular}}", "{$controller}@update");
    $router->delete("/$path/{{$pathSingular}}", "{$controller}@destroy");
}

Resource($router, "accounts", "AccountController");
Resource($router, "posts", "PostController");
