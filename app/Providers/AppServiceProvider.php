<?php

namespace App\Providers;

use App\Models\Review;
use App\Models\Thread;
use App\Observers\ReviewObserver;
use App\Observers\ThreadObserver;
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
        Thread::observe(ThreadObserver::class);
        Review::observe(ReviewObserver::class);
    }
}
