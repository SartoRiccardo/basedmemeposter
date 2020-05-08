<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('api', function ($request) {
            $authorization = $request->header("Authorization");
            $token = substr($authorization, 7);
            if(!$token || substr_count($token, ".") !== 2) return null;

            [$headerRaw, $payloadRaw, $signature] = explode(".", $token);
            $payload = json_decode(base64_decode($payloadRaw));
            $header = json_decode(base64_decode($headerRaw));

            $user = User::find($payload->user);
            if(!$user || hash("sha256", $headerRaw.$payloadRaw.$user->salt) !== $signature) return null;

            return $user;
        });
    }
}
