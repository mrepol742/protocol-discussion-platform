<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ThreadController extends Controller
{
    /**
     * Display a listing of the threads, optionally filtered by protocol.
     *
     * @return LengthAwarePaginator
     */
    public function index(): LengthAwarePaginator
    {
        return Thread::with('protocol')->latest()->paginate(10);
    }

    /**
     * Store a newly created thread in storage.
     *
     * @param Request $request
     * @return Thread
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
     *
     * @param Thread $thread
     * @return Thread
     */
    public function show(Thread $thread): Thread
    {
        return $thread->load('comments');
    }

    /**
     * Update the specified thread in storage.
     *
     * @param Request $request
     * @param Thread $thread
     * @return Thread
     */
    public function update(Request $request, Thread $thread): Thread
    {
        $thread->update($request->only('title', 'body'));

        return $thread;
    }

    /**
     * Remove the specified thread from storage.
     *
     * @param Thread $thread
     * @return Response
     */
    public function destroy(Thread $thread): Response
    {
        $thread->delete();
        return response()->noContent();
    }

    /**
     * Search threads by title or body.
     *
     * @param Request $request
     * @return Collection
     */
    public function search(Request $request): Collection
    {
        return Thread::search($request->q)->get();
    }
}
