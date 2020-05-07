<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Post::paginate(50);
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
              "platform" => "required|exists:platforms,name",
              "originalId" => "required|max:32",
              "originalLink" => "required|url",
              "thumbnail" => "required|url",
            ]);
        }
        catch(ValidationException $exception) {
            return response()->json($exception->errors(), 400);
        }

        $post = new Post();
        $post->platform = request("platform");
        $post->originalId = request("originalId");
        $post->originalLink = request("originalLink");
        $post->thumbnail = request("thumbnail");
        $post->save();

        return response(["data" => $post], 201)->header("Location", "/posts/{$post->id}");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show($post)
    {
        $post = Post::find($post);
        if($post === null) {
            return $this->resourceNotFound();
        }

        return ["data" => $post];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $post)
    {
        $post = Post::find($post);
        if($post === null) {
            return $this->resourceNotFound();
        }

        try {
            $this->validate($request, [
              "platform" => "required|exists:platforms,name",
              "originalId" => "required|max:32",
              "originalLink" => "required|url",
              "thumbnail" => "required|url",
            ]);
        }
        catch(ValidationException $exception) {
            return response()->json($exception->errors(), 400);
        }

        $post->platform = request("platform");
        $post->originalId = request("originalId");
        $post->originalLink = request("originalLink");
        $post->thumbnail = request("thumbnail");
        $post->save();

        return ["data" => $post];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy($post)
    {
        $post = Post::find($post);
        if($post === null) {
            return $this->resourceNotFound();
        }
        $post->delete();
    }
}
