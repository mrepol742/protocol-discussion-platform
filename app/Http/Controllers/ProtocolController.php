<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProtocolController extends Controller
{
    /**
     * Display a listing of the protocols.
     */
    public function index()
    {
        return Protocol::latest()->paginate(10);
    }

    /**
     * Store a newly created protocol in storage.
     */
    public function store(Request $request): \Illuminate\Http\Response
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
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
     * Display the specified protocol along with its threads and reviews.
     */
    public function show(Protocol $protocol): Protocol
    {
        return $protocol->load('threads', 'reviews');
    }

    /**
     * Update the specified protocol in storage.
     */
    public function update(Request $request, Protocol $protocol): Protocol
    {
        $protocol->update($request->only('title', 'content', 'tags'));

        return $protocol;
    }

    /**
     * Remove the specified protocol from storage.
     */
    public function destroy(Protocol $protocol): \Illuminate\Http\Response
    {
        $protocol->delete();
        return response()->noContent();
    }

    /**
     * Search for protocols based on a query string.
     */
    public function search(Request $request): \Illuminate\Support\Collection
    {
        $request->validate(['q' => 'required|string']);
        return Protocol::search($request->q)->options([
            'query_by' => 'title, tags'
        ])->get();
    }
}
