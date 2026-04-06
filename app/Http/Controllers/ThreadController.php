<?php

namespace App\Http\Controllers;

use App\Rules\NotBadWord;
use Illuminate\Http\JsonResponse;
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
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function index($id, Request $request): LengthAwarePaginator
    {
        $request->merge([
            'isMostRecent' => filter_var(
                $request->query('isMostRecent'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
            'topRated' => filter_var(
                $request->query('topRated'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
        ]);

        $request->validate([
            'q' => 'nullable|string',
            'isMostRecent' => 'nullable|boolean',
            'topRated' => 'nullable|boolean',
        ]);

        $query = $request->q;
        $perPage = 10;
        $page = LengthAwarePaginator::resolveCurrentPage();

        $sortFields = [];

        // Add fields based on request flags
        if ($request->isMostRecent) {
            $sortFields[] = 'created_at:desc';
        }

        if ($request->topRated) {
            $sortFields[] = 'votes_count:desc';
        }

        // Join into a comma-separated string for sort_by
        $sort = implode(',', $sortFields);

        $results = Thread::search($query)
            ->options([
                'query_by' => 'title, body, tags',
                'sort_by' => $sort ?: null,
                'filter_by' => 'protocol_id:=' .$id,
            ])
            ->raw();

        $documents = collect($results['hits'])->map(fn($hit) => $hit['document']);

        $paginated = new LengthAwarePaginator(
            $documents->forPage($page, $perPage),
            count($documents),
            $perPage,
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath()],
        );

        return $paginated;
    }

    /**
     * Store a newly created thread in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', 'unique:threads,title', new NotBadWord()],
            'body' => ['required', 'string', 'unique:threads,body', new NotBadWord()],
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

        return response()->json($thread, 201);
    }

    /**
     * Display the specified thread along with its protocol information.
     *
     * @param int $id
     * @return Thread
     */
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
     * @return JsonResponse
     */
    public function update(Request $request, Thread $thread): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', 'unique:threads,title', new NotBadWord()],
            'body' => ['required', 'string', 'unique:threads,body', new NotBadWord()],
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

        return response()->json($thread);
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
}
