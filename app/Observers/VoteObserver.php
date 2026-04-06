<?php

namespace App\Observers;

use App\Models\Vote;
use App\Models\Thread;

class VoteObserver
{
    /**
     * Handle the vote "created" event.
     */
    public function created(Vote $vote): void
    {
        $this->updateVotableCount($vote);
    }

    /**
     * Handle the vote "updated" event.
     */
    public function updated(Vote $vote): void
    {
        $this->updateVotableCount($vote);
    }

    /**
     * Handle the vote "deleted" event.
     */
    public function deleted(Vote $vote): void
    {
        $this->updateVotableCount($vote);
    }

    /**
     * Update the votes_count for the related votable
     */
    protected function updateVotableCount(Vote $vote): void
    {
        // Only threads have votes_count
        if ($vote->votable_type === 'thread') {
            $thread = $vote->votable; // morph relation
            if ($thread) {
                $thread->votes_count = $thread
                    ->votes()
                    ->sum(\DB::raw('CASE WHEN is_upvote THEN 1 ELSE -1 END'));
                $thread->save();
            }
        }
    }
}
