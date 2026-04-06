<?php

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProtocolController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoteController;

RateLimiter::for('api-auth-actions', function ($request) {
    return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('api-actions', function ($request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

Route::group(['prefix' => 'auth'], function () {
    Route::middleware('throttle:api-auth-actions')->group(function () {
        Route::post('/login', [LoginController::class, 'login']);
        Route::post('/register', [RegisterController::class, 'register']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/verify-session', [SessionController::class, 'verifySession']);
        Route::post('/logout', [SessionController::class, 'logout']);
    });
});

/**
 * This was seperated into two resource controllers to allow for unauthenticated users to view protocols and threads,
 * but only authenticated users can create, update, or delete them.
 */
Route::middleware('sanctum.optional')
    ->apiResource('protocols', ProtocolController::class)
    ->only(['index', 'show']);

Route::get('threads/{id}/info', [ThreadController::class, 'getThreadInfo']);
Route::get('threads/{id}', [ThreadController::class, 'index']);

Route::get('comments/{id}', [CommentController::class, 'show']);
Route::apiResource('comments', CommentController::class)->only(['index']);

Route::get('reviews/{id}', [ReviewController::class, 'show']);
Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);

Route::middleware(['auth:sanctum', 'throttle:api-actions'])->group(function () {
    Route::apiResource('protocols', ProtocolController::class)->only([
        'store',
        'update',
        'destroy',
    ]);

    Route::apiResource('threads', ThreadController::class)->only(['store', 'update', 'destroy']);

    Route::apiResource('comments', CommentController::class)->only(['store', 'update', 'destroy']);

    Route::apiResource('reviews', ReviewController::class)->only(['store', 'update', 'destroy']);

    Route::post('/vote', [VoteController::class, 'vote']);
});

// for health check
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});
