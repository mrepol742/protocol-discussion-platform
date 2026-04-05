<?php

namespace App\Http\Controllers;

use App\Rules\NotBadWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;

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
     * @return LengthAwarePaginator
     */
    public function show($id): LengthAwarePaginator
    {
        return Review::where('protocol_id', $id)->with('user')->latest()->paginate(10);
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
