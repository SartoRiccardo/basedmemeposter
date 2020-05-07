<?php

namespace App\Http\Controllers;

use App\Log;
use App\Account;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public $resourceName = "Log";

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $accounts = $request->query("accounts");
        $levels = $request->query("levels");

        $logs = Log::orWhere(function($query) use ($accounts) {
                    if(!$accounts) return;
                    foreach ($accounts as $account) {
                        $query->where("account", "=", $account);
                    }
                })
                ->where(function($query) use ($levels) {
                    if(!$levels) return;
                    foreach ($levels as $level) {
                        $query->orWhere("level", "=", $level);
                    }
                })
                ->paginate(100);

        foreach ($logs as $log) {
            $log["account"] = Account::find($log["account"]);
        }
        return $logs;
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
                "level" => "required|in:debug,info,log,warning,error,critical",
                "account" => "integer|required|exists:accounts,id",
                "message" => "string|required",
            ]);
        }
        catch(ValidationException $exception) {
            return response($exception->errors(), 400);
        }

        $log = new Log();
        $log->level = request("level");
        $log->account = request("account");
        $log->message = request("message");
        $log->save();

        $log["account"] = Account::find($log["account"]);
        return response(["data" => $log], 201)->header("Location", "/logs/{$log->id}");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function show($log)
    {
        $log = Log::find($log);
        if(!$log) {
            return $this->resourceNotFound();
        }
        $log["account"] = Account::find($log["account"]);
        return ["data" => $log];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $log)
    {
        return response(null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function destroy($log)
    {
        $log = Log::find($log);
        if(!$log) {
            return $this->resourceNotFound();
        }
        $log->delete();
    }
}
