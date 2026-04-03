<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProtocolController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoteController;

Route::group(['prefix' => 'auth'], function () {
    Route::middleware('throttle:9990,30')->group(function () {
        Route::post('/login', [LoginController::class, 'login']);
        Route::post('/register', [RegisterController::class, 'register']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/verify-session', [SessionController::class, 'verifySession']);
        Route::post('/logout', [SessionController::class, 'logout']);
    });
});

Route::get('protocols/search', [ProtocolController::class, 'search']);
Route::apiResource('protocols', ProtocolController::class);

Route::get('threads/search', [ProtocolController::class, 'search']);
Route::apiResource('threads', ThreadController::class);
Route::apiResource('comments', CommentController::class)->only(['store', 'update', 'destroy']);
Route::apiResource('reviews', ReviewController::class)->only(['store', 'update', 'destroy']);

// Voting
Route::post('/vote', [VoteController::class, 'vote']);

// for health check
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});
