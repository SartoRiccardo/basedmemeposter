<?php

namespace App\Http\Controllers;

use App\Caption;
use Illuminate\Http\Request;

class CaptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Caption::paginate(60);
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
                "text" => "string|required|unique:captions",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $caption = new Caption();
        $caption->text = request("text");
        $caption->save();

        return response(["data" => $caption], 201)
                   ->header("Location", "/captions/{$caption->id}");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Caption  $caption
     * @return \Illuminate\Http\Response
     */
    public function show($caption)
    {
        $caption = Caption::find($caption);
        if(!$caption) return $this->resourceNotFound();
        return ["data" => $caption];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Caption  $caption
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $caption)
    {
        $caption = Caption::find($caption);
        if(!$caption) return $this->resourceNotFound();

        try {
            $this->validate($request, [
                "text" => "string|required|unique:captions,text,{$caption->id}",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $caption->text = request("text");
        $caption->save();

        return response(["data" => $caption]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Caption  $caption
     * @return \Illuminate\Http\Response
     */
    public function destroy($caption)
    {
        $caption = Caption::find($caption);
        if(!$caption) return $this->resourceNotFound();
        $caption->delete();
    }
}
