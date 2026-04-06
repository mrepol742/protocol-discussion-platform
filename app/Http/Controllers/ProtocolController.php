<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use App\Rules\NotBadWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;

class ProtocolController extends Controller
{
    /**
     * Display and search a listing of the protocols.
     *
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function index(Request $request): LengthAwarePaginator
    {
        $request->merge([
            'isMostRecent' => filter_var(
                $request->query('isMostRecent'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
            'isMostReviews' => filter_var(
                $request->query('isMostReviews'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
            'isHighestRated' => filter_var(
                $request->query('isHighestRated'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
            'everyone' => filter_var(
                $request->query('everyone'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ),
        ]);

        $request->validate([
            'q' => 'nullable|string',
            'isMostRecent' => 'nullable|boolean',
            'isMostReviews' => 'nullable|boolean',
            'isHighestRated' => 'nullable|boolean', // true = rate, false = upvotes
            'everyone' => 'nullable|boolean',
        ]);

        $query = $request->q;
        $perPage = 20;
        $page = LengthAwarePaginator::resolveCurrentPage();

        $sortFields = [];

        // Add fields based on request flags
        if ($request->isMostRecent) {
            $sortFields[] = 'created_at:desc';
        }

        if ($request->isMostReviews) {
            $sortFields[] = 'reviews_count:desc';
        }

        if (!is_null($request->isHighestRated)) {
            $sortField = $request->isHighestRated ? 'average_rating' : 'votes_count';
            $sortFields[] = $sortField . ':desc';
        }

        // Join into a comma-separated string for sort_by
        $sort = implode(',', $sortFields);

        $userId = auth()->check() ? auth()->id() : null;
        $filter = null;

        if ($userId) {
            if ($request->everyone) {
                // Exclude current user's protocols
                $filter = "author_id:!= $userId";
                info('Excluding user ID: ' . $userId);
            } else {
                // Meilisearch expects array or string filter like "author_id:= 123"
                $filter = "author_id:= $userId";
                info('Filtering out user ID: ' . $userId);
            }
        }

        $results = Protocol::search($query)
            ->options([
                'query_by' => 'title, content, tags',
                'sort_by' => $sort ?: null,
                'filter_by' => $filter,
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
     * Store a newly created protocol in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => [
                'required',
                'string',
                'max:255',
                'unique:protocols,title',
                new NotBadWord(),
            ],
            'content' => ['required', 'string', 'unique:protocols,content', new NotBadWord()],
            'tags' => 'required|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $protocol = Protocol::create([
            'title' => $request->title,
            'content' => $request->content,
            'tags' => $request->tags,
            'author_id' => auth()->id(),
        ]);

        return response()->json($protocol, 201);
    }

    /**
     * Display the specified protocol.
     *
     * @param int $id
     * @return Protocol
     */
    public function show($id): Protocol
    {
        return Protocol::with('author')->findOrFail($id);
    }

    /**
     * Update the specified protocol in storage.
     *
     * @param Request $request
     * @param Protocol $protocol
     * @return JsonResponse
     */
    public function update(Request $request, Protocol $protocol): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => [
                'required',
                'string',
                'max:255',
                'unique:protocols,title,' . $protocol->id,
                new NotBadWord(),
            ],
            'content' => [
                'required',
                'string',
                'unique:protocols,content,' . $protocol->id,
                new NotBadWord(),
            ],
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $protocol->update($request->only('title', 'content', 'tags'));

        return response()->json($protocol);
    }

    /**
     * Remove the specified protocol from storage.
     *
     * @param Protocol $protocol
     * @return Response
     */
    public function destroy(Protocol $protocol): Response
    {
        $protocol->delete();
        return response()->noContent();
    }
}
