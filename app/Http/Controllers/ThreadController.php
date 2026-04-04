<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use App\Rules\NotBadWord;
use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', new NotBadWord()],
            'body' => ['required', 'string', new NotBadWord()],
            'protocol_id' => 'required|exists:protocols,id',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $thread = Thread::create([
            'title' => $request->title,
            'body' => $request->body,
            'protocol_id' => $request->protocol_id,
            'user_id' => auth()->id(),
        ]);

        return $thread;
    }

    public function getThreadInfo($id): Thread
    {
        return Thread::with('protocol')->findOrFail($id);
    }

    /**
     * Display the specified thread along with its comments.
     *
     * @param int $id
     * @return LengthAwarePaginator
     */
    public function show($id): LengthAwarePaginator
    {
        return Thread::where('protocol_id', $id)->latest()->paginate(10);
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
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', new NotBadWord()],
            'body' => ['required', 'string', new NotBadWord()],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

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
        $request->validate(['q' => 'required|string']);
        return Thread::search($request->q)
            ->options([
                'query_by' => 'title, body, tags',
            ])
            ->paginate(10);
    }
}
