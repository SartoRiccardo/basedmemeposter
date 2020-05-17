<?php

namespace App\Http\Controllers;

use App\Log;
use App\Account;
use App\Ignored;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $accounts = $request->query("accounts");
        $levels = $request->query("levels");

        $logs = Log::where(function($query) use ($accounts) {
                    if(!$accounts) return;
                    foreach ($accounts as $account) {
                        $query->orWhere("account", "=", $account);
                    }
                })
                ->where(function($query) use ($levels) {
                    if(!$levels) return;
                    foreach ($levels as $level) {
                        $query->orWhere("level", "=", $level);
                    }
                })
                ->orderBy("date", "DESC")
                ->paginate(100);

        $levels = ["debug", "info", "warning", "error", "critical"];
        $levelCount = [];
        foreach ($levels as $level) {
            $levelCount[$level] = Log::where("level", "=", $level)->count();
        }
        $levelCount = collect(["level_count" => $levelCount]);

        foreach ($logs as $log) {
            $log["account"] = Account::find($log["account"]);
        }
        return ["data" => $levelCount->merge($logs)];
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
                "account" => "integer|exists:accounts,id",
                "message" => "string|required",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $log = new Log();
        $log->level = request("level");
        if(request("account")) $log->account = request("account");
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

    public function ignore(Request $request)
    {
        try {
            $this->validate($request, [
                "level" => ["required", "in:debug,info,log,warning,error,critical"],
                "amount" => ["integer", "required"],
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $level = $request->query("level");
        $amount = (int) $request->query("amount");
        $user = $request->user();

        $ignored = Ignored::where("level", "=", $level)->where("user", "=", $user->id)->first();
        if(!$ignored) return $this->resourceNotFound();
        $ignored->ignored = $amount;
        $ignored->save();
        return ["data" => $ignored];
    }
}
