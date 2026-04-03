<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProtocolController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoteController;

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
