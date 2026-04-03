<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     *
     * @param Request $request
     * @return Comment
     */
    public function store(Request $request): Comment
    {
        return Comment::create([
            'body' => $request->body,
            'thread_id' => $request->thread_id,
            'user_id' => auth()->id(),
            'parent_id' => $request->parent_id,
        ]);
    }

    /**
     * Update the specified comment in storage.
     *
     * @param Request $request
     * @param Comment
     */
    public function update(Request $request, Comment $comment): Comment
    {
        $comment->update([
            'body' => $request->body
        ]);

        return $comment;
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param Comment $comment
     * @return Response
     */
    public function destroy(Comment $comment): Request
    {
        $comment->delete();
        return response()->noContent();
    }
}
