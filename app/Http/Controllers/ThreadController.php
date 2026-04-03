<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;

class ThreadController extends Controller
{
    /**
     * Display a listing of the threads, optionally filtered by protocol.
     */
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        return Thread::with('protocol')->latest()->paginate(10);
    }

    /**
     * Store a newly created thread in storage.
     */
    public function store(Request $request): Thread
    {
        $thread = Thread::create([
            'title' => $request->title,
            'body' => $request->body,
            'protocol_id' => $request->protocol_id,
            'user_id' => auth()->id(),
        ]);

        return $thread;
    }

    /**
     * Display the specified thread along with its comments.
     */
    public function show(Thread $thread): Thread
    {
        return $thread->load('comments');
    }

    /**
     * Update the specified thread in storage.
     */
    public function update(Request $request, Thread $thread): Thread
    {
        $thread->update($request->only('title', 'body'));

        return $thread;
    }

    /**
     * Remove the specified thread from storage.
     */
    public function destroy(Thread $thread): \Illuminate\Http\Response
    {
        $thread->delete();
        return response()->noContent();
    }

    /**
     * Search threads by title or body.
     */
    public function search(Request $request): \Illuminate\Support\Collection
    {
        return Thread::search($request->q)->get();
    }
}
