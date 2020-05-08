<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        $auth = substr($request->header("Authorization"), 6);
        if(substr_count($auth, ":") < 1) return $this->unauthorizedResponse();
        [$username, $password] = explode(":", $auth);

        $user = User::where("username", "=", $username)->first();
        if(!$user || $user->password !== hash("sha256", $password.$user->salt)) {
            return $this->unauthorizedResponse();
        }

        $header = base64_encode(json_encode([
            "encryption" => "sha256",
        ]));
        $payload = base64_encode(json_encode([
            "user" => $user->id,
        ]));
        $secret = hash("sha256", $header.$payload.$user->salt);

        return ["data" => ["token" => "$header.$payload.$secret"]];
    }

    public function me(Request $request)
    {
        [,$payload,] = explode(".", substr($request->header("Authorization"), 7));
        return ["data" => json_decode(base64_decode($payload))];
    }

    public function unauthorizedResponse() {
        return response(["errors" => [["title" => "Invalid credentials."]]]);
    }
}
