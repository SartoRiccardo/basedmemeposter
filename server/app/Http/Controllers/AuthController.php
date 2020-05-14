<?php

namespace App\Http\Controllers;

use App\User;
use App\Token;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        $auth = substr($request->header("X-Authorization"), 6);
        if(substr_count($auth, ":") < 1) return $this->unauthorizedResponse();
        [$username, $password] = explode(":", $auth);

        $user = User::where("username", "=", $username)->first();
        if(!$user || $user->password !== hash("sha256", $password.$user->salt)) {
            return $this->unauthorizedResponse();
        }

        $tokenLen = 255;
        do {
            $token = $this->randomString(255);
        } while(Token::find($token));

        $expire = date_create(date("Y-m-d H:i:s"));
        date_add($expire, date_interval_create_from_date_string("7 days"));

        $tokenModel = new Token();
        $tokenModel->token = $token;
        $tokenModel->user = $user->id;
        $tokenModel->expire = date_format($expire, "Y-m-d H:i:s");
        $tokenModel->save();

        $this->deleteOldTokens();

        $user->token = $token;
        $user->ignored;
        return ["data" => $user];
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->ignored;
        return ["data" => $user];
    }

    public function unauthorizedResponse() {
        return response(["errors" => [["title" => "Invalid credentials."]]], 401);
    }

    public function randomString($len) {
        $characters = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
        $ret = "";
        for($i=0; $i < $len; $i++) {
            $index = rand(0, strlen($characters)-1);
            $ret .= substr($characters, $index, 1);
        }
        return $ret;
    }

    public function deleteOldTokens() {
        Token::where("expire", "<", date("Y-m-d H:i:s"))->delete();
    }
}
