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
    public function index(Request $request)
    {
        $after = $request->query("after");
        $platforms = $request->query("platforms");

        $posts = Post::where(function($query) use ($platforms) {
          if(!$platforms) return;
          foreach ($platforms as $platform) {
              $query->orWhere("platform", "=", $platform);
          }
        });
        if($after) {
            $posts = $posts->where("dateAdded", ">", $after);
        }
        $posts = $posts->paginate(50);

        return ["data" => $posts];
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
              "contentUrl" => "required|url",
              "thumbnail" => "required|url",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $post = new Post();
        $post->platform = request("platform");
        $post->originalId = request("originalId");
        $post->originalLink = request("originalLink");
        $post->contentUrl = request("contentUrl");
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

    public function showByOtherId($platform, $post)
    {
        $post = Post::where("platform", "=", $platform)->where("originalId", "=", $post)->first();
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
              "contentUrl" => "required|url",
              "thumbnail" => "required|url",
            ]);
        }
        catch(ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        $post->platform = request("platform");
        $post->originalId = request("originalId");
        $post->originalLink = request("originalLink");
        $post->contentUrl = request("contentUrl");
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
