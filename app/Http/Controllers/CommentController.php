<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
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
     */
    public function destroy(Comment $comment): \Illuminate\Http\Response
    {
        $comment->delete();
        return response()->noContent();
    }
}
