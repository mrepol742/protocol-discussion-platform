<?php

namespace App\Providers;

use App\Models\Review;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\User;
use App\Models\Vote;
use App\Observers\ReviewObserver;
use App\Observers\ThreadObserver;
use App\Observers\VoteObserver;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // setup observers
        Thread::observe(ThreadObserver::class);
        Review::observe(ReviewObserver::class);
        Vote::observe(VoteObserver::class);

        // enforce morph map for votes
        Relation::enforceMorphMap([
            'thread' => Thread::class,
            'comment' => Comment::class,
            'user' => User::class
        ]);

        RateLimiter::for('api-auth-actions', function ($request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('api-actions', function ($request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
