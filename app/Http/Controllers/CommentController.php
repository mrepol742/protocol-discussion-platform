<?php

namespace App\Http\Controllers;

use App\Rules\NotBadWord;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

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
        $validator = Validator::make($request->all(), [
            'thread_id' => ['required', 'exists:threads,id'],
            'body' => ['required', 'string', 'max:255', new NotBadWord()],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        return Comment::create([
            'body' => $request->body,
            'thread_id' => $request->thread_id,
            'user_id' => auth()->id(),
            // temp solution for parent_id, will be used for nested comments in the future
            'parent_id' => $request->parent_id ?? null,
        ]);
    }

    /**
     * Display the specified comment along with its replies.
     *
     * @param int $id
     * @return LengthAwarePaginator
     */
    public function show($id)
    {
        return Comment::where('thread_id', $id)
            ->with(['user', 'replies', 'votes'])
            ->withCount([
                'votes as upvotes_count' => fn($q) => $q->where('is_upvote', 1),
            ])
            ->orderByDesc('upvotes_count')
            ->get();
    }

    /**
     * Update the specified comment in storage.
     *
     * @param Request $request
     * @param Comment
     */
    public function update(Request $request, Comment $comment): Comment
    {
        if (!$this->checkOwnership($comment)) {
            return response()->json(
                [
                    'error' => 'Deletion denied. You are not the owner of this protocol.',
                ],
                422,
            );
        }

        $validator = Validator::make($request->all(), [
            'body' => ['required', 'string', 'max:255', new NotBadWord()],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $comment->update([
            'body' => $request->body,
        ]);

        return $comment;
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param Comment $comment
     * @return Response
     */
    public function destroy(Comment $comment): Response
    {
        if (!$this->checkOwnership($comment)) {
            return response()->json(
                [
                    'error' => 'Deletion denied. You are not the owner of this protocol.',
                ],
                422,
            );
        }

        $comment->delete();
        return response()->noContent();
    }

    /**
     * Check if the authenticated user is the owner of the comment.
     *
     * @param Comment $comment
     * @return bool
     */
    private function checkOwnership(Comment $comment): bool
    {
        return $comment->user_id === auth()->id();
    }
}
