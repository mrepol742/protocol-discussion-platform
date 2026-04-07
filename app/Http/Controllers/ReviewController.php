<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ReviewSummarizer;
use App\Rules\NotBadWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Laravel\Ai\Messages\Message;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'protocol_id' => 'required|exists:protocols,id',
            'feedback' => ['required', 'string', 'max:255', new NotBadWord()],
            'rating' => 'required|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $review = Review::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'protocol_id' => $request->protocol_id,
            ],
            [
                'rating' => $request->rating,
                'feedback' => $request->feedback,
            ],
        );

        return response()->json($review, 201);
    }

    /**
     * Display the specified thread along with its comments.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $paginatedReviews = Review::where('protocol_id', $id)->with('user')->latest()->paginate(20);

        $feedbacks = $paginatedReviews
            ->getCollection()
            ->pluck('feedback')
            ->filter(fn($feedback) => filled($feedback))
            ->take(10)
            ->values()
            ->toArray();

        $summary = '';

        if (!empty($feedbacks)) {
            $agent = new ReviewSummarizer($feedbacks);

            $instructions = (string) $agent->instructions();

            $messagesPayload = collect($agent->messages())
                ->map(function ($message) {
                    if ($message instanceof Message) {
                        return [
                            'role' => $message->role ?? null,
                            'content' => $message->content ?? null,
                        ];
                    }

                    return (string) $message;
                })
                ->values()
                ->all();

            $fingerprint = hash(
                'sha256',
                json_encode(
                    [
                        'instructions' => $instructions,
                        'messages' => $messagesPayload,
                        'protocol_id' => (int) $id,
                        'page' => (int) $paginatedReviews->currentPage(),
                    ],
                    JSON_UNESCAPED_UNICODE,
                ),
            );

            $cacheKey = "reviews:summary:{$fingerprint}";

            $summary = Cache::remember($cacheKey, now()->addHours(6), function () use ($agent) {
                // minimal runtime prompt to trigger generation
                return (string) $agent->prompt('Generate now.');
            });
        }

        return response()->json([
            'summary' => $summary,
            'data' => $paginatedReviews->items(),
            'current_page' => $paginatedReviews->currentPage(),
            'last_page' => $paginatedReviews->lastPage(),
            'per_page' => $paginatedReviews->perPage(),
            'total' => $paginatedReviews->total(),
            'from' => $paginatedReviews->firstItem(),
            'to' => $paginatedReviews->lastItem(),
            'next_page_url' => $paginatedReviews->nextPageUrl(),
            'prev_page_url' => $paginatedReviews->previousPageUrl(),
        ]);
    }

    /**
     * Update the specified review in storage.
     *
     * @param Request $request
     * @param Review $review
     * @return JsonResponse
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'feedback' => ['required', 'string', 'max:255', new NotBadWord()],
            'rating' => 'required|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $review->update($request->only('rating', 'feedback'));
        return $review;
    }

    /**
     * Remove the specified review from storage.
     *
     * @param Review $review
     * @return Response
     */
    public function destroy(Review $review): Response
    {
        $review->delete();
        return response()->noContent();
    }
}
