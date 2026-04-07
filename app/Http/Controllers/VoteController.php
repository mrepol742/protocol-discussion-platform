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
    public function vote(Request $request)
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

        // Check if user has already voted
        $existingVote = Vote::where('user_id', auth()->id())
            ->where('votable_id', $request->votable_id)
            ->where('votable_type', $request->votable_type)
            ->first();

        if ($existingVote) {
            // If vote direction is the same, return error
            if ($existingVote->is_upvote == $request->is_upvote) {
                return response()->json(
                    [
                        'error' =>
                            'You have already ' .
                            ($request->is_upvote ? 'upvoted' : 'downvoted') .
                            ' this item.',
                    ],
                    400,
                );
            }

            // If vote direction is different, update the vote
            $existingVote->update(['is_upvote' => $request->is_upvote]);
            return $existingVote;
        }

        // Create new vote
        $vote = Vote::create([
            'user_id' => auth()->id(),
            'votable_id' => $request->votable_id,
            'votable_type' => $request->votable_type,
            'is_upvote' => $request->is_upvote,
        ]);

        return $vote;
    }
}
