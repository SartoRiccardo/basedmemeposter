<?php

namespace App\Http\Controllers;

use App\Source;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ["data" => Source::all()];
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
            $platform = request("platform");
            $this->validate($request, [
                "name" => "required|unique:sources,name,NULL,id,platform,{$platform}",
                "platform" => "required|exists:platforms,name",
            ]);
        }
        catch(ValidatorException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $source = new Source();
        $source->platform = request("platform");
        $source->name = request("name");
        $source->save();

        return response(["data" => $source], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function show($source)
    {
        $source = Source::find($source);
        if(!$source) return $this->resourceNotFound();
        return ["data" => $source];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $source)
    {
        $source = Source::find($source);
        if(!$source) return $this->resourceNotFound();

        try {
            $platform = request("platform");
            $this->validate($request, [
                "name" => "required|unique:sources,name,{$source->id},id,platform,{$platform}",
                "platform" => "required|exists:platforms,name",
            ]);
        }
        catch(ValidatorException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $source->platform = request("platform");
        $source->name = request("name");
        $source->save();

        return ["data" => $source];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function destroy($source)
    {
        $source = Source::find($source);
        if(!$source) return $this->resourceNotFound();
        $source->delete();
    }
}
