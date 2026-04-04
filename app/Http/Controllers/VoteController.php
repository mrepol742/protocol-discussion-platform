<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Vote;
use Illuminate\Support\Facades\Validator;

class VoteController extends Controller
{
    /**
     * Handle voting on threads and comments.
     *
     * @param Request $request
     * @return Vote
     */
    public function vote(Request $request): Vote
    {
        $validator = Validator::make($request->all(), [
            'votable_type' => 'required|in:thread,comment',
            'votable_id' => 'required|integer',
            'is_upvote' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $model = $request->votable_type === 'thread' ? Thread::class : Comment::class;

        $vote = Vote::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'votable_id' => $request->votable_id,
                'votable_type' => $model,
            ],
            [
                'is_upvote' => $request->is_upvote,
            ],
        );

        return $vote;
    }
}
