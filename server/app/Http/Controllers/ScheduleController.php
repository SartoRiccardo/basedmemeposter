<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\Post;
use App\Account;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $account = $request->query("account");

        $schedule = null;
        if($account !== null) {
            $schedule = Schedule::where("account", "=", $account);
        }
        else {
            $schedule = Schedule::all();
        }
        if($request->query("onlyScheduled")) {
            $schedule = $schedule->where("date", ">", date("Y-m-d H:i:s"));
        }
        $schedule = $schedule->get();

        foreach ($schedule as $s) {
            $s["post"] = Post::find($s["post"]);
            $s["account"] = Account::find($s["account"]);
        }
        return ["data" => $schedule];
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
              "account" => "integer|required|exists:accounts,id|".
                  "unique:schedule,account,NULL,id,post,".request("post"),
              "post" => "integer|required|exists:posts,id",
              "date" => "required|date_format:Y-m-d H:i:s",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $schedule = new Schedule();
        $schedule->account = request("account");
        $schedule->post = request("post");
        $schedule->date = request("date");
        $schedule->save();

        return response(["data" => $schedule], 201)->header("Location", "/schedule/{$schedule->id}");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show($schedule)
    {
        $schedule = Schedule::find($schedule);
        if(!$schedule) {
          return $this->resourceNotFound();
        }
        $schedule["account"] = Post::find($schedule["account"]);
        $schedule["post"] = Post::find($schedule["post"]);
        return ["data" => $schedule];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $schedule)
    {
        $schedule = Schedule::find($schedule);
        if(!$schedule) {
          return $this->resourceNotFound();
        }

        $keysChanged = $schedule->post !== request("post")
            || $schedule->account !== request("account");
        $uniqueness = $keysChanged ? "|unique:schedule,account,NULL,id,post,".request("post") : "";

        try {
            $this->validate($request, [
              "account" => "integer|required|exists:accounts,id".$uniqueness,
              "post" => "integer|required|exists:posts,id",
              "date" => "required|date_format:Y-m-d H:i:s",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $schedule->account = request("account");
        $schedule->post = request("post");
        $schedule->date = request("date");
        $schedule->save();

        return ["data" => $schedule];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy($schedule)
    {
        $schedule = Schedule::find($schedule);
        if(!$schedule) {
          return $this->resourceNotFound();
        }
        $schedule->delete();
    }
}
