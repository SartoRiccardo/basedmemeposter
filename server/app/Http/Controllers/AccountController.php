<?php

namespace App\Http\Controllers;

use App\Account;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $accounts = Account::all()->makeVisible(["password"]);
        return ["data" => $accounts];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
          $this->validate($request, [
            "username" => "required|unique:accounts|max:30",
            "password" => "required",
            "startTime" => "required|date_format:H:i:s",
            "endTime" => "required|date_format:H:i:s",
          ]);
        }
        catch(ValidationException $exception) {
          return $this->validationErrorResponse($exception);
        }

        $account = new Account();
        $account->username = request("username");
        $account->password = request("password");
        $account->startTime = request("startTime");
        $account->endTime = request("endTime");
        $account = $account->makeVisible(["password"]);
        $account->save();

        return response(["data" => $account], 201)
            ->header("Location", "/accounts/{$account->id}");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function show($account)
    {
        $account = Account::find($account);
        if(!$account) {
          return $this->resourceNotFound();
        }
        $account = $account->makeVisible(["password"]);
        return ["data" => $account];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $account)
    {
        $account = Account::find($account);
        if($account === null) {
          return $this->resourceNotFound();
        }

        try {
          $usernameUnchanged = $account->username === request("username");
          $usernameUnique = $usernameUnchanged ? "" : "unique:accounts|";
          $this->validate($request, [
            "username" => "required|{$usernameUnique}max:30",
            "password" => "required",
            "startTime" => "required|date_format:H:i:s",
            "endTime" => "required|date_format:H:i:s",
          ]);
        }
        catch(ValidationException $exception) {
          return $this->validationErrorResponse($exception);
        }

        $account->username = request("username");
        $account->password = request("password");
        $account->startTime = request("startTime");
        $account->endTime = request("endTime");
        $account = $account->makeVisible(["password"]);
        $account->save();

        return ["data" => $account];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function destroy($account)
    {
        $account = Account::find($account);
        if($account === null) {
          return $this->resourceNotFound();
        }
        $account->delete();
    }
}
