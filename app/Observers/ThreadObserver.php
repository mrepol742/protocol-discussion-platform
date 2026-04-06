<?php

namespace App\Observers;

use App\Models\Thread;

class ThreadObserver
{
    /**
     * Handle the Thread "created" event.
     */
    public function created(Thread $thread): void
    {
        $this->synced($thread);
    }

    /**
     * Handle the Thread "updated" event.
     */
    public function updated(Thread $thread): void
    {
        $this->synced($thread);
    }

    /**
     * Handle the Thread "deleted" event.
     */
    public function deleted(Thread $thread): void
    {
        $this->synced($thread);
    }

    /**
     * Handle the Thread "restored" event.
     */
    public function restored(Thread $thread): void
    {
        $this->synced($thread);
    }

    /**
     * Handle the Thread "force deleted" event.
     */
    public function forceDeleted(Thread $thread): void
    {
        $this->synced($thread);
    }

    /**
     * Sync the thread and its protocol with the search index.
     */
    public function synced(Thread $thread): void
    {
        $thread->protocol->searchable();
        $thread->searchable();
    }
}
