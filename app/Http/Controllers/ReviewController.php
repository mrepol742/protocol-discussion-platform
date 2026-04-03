<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     *
     * @param Request $request
     * @return Review
     */
    public function store(Request $request): Review
    {
        return Review::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'protocol_id' => $request->protocol_id,
            ],
            [
                'rating' => $request->rating,
                'feedback' => $request->feedback,
            ]
        );
    }

    /**
     * Update the specified review in storage.
     *
     * @param Request $request
     * @param Review $review
     * @return Review
     */
    public function update(Request $request, Review $review): Review
    {
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
