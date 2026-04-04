<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use App\Rules\NotBadWord;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

class ProtocolController extends Controller
{
    /**
     * Display a listing of the protocols.
     *
     * @return LengthAwarePaginator
     */
    public function index(): LengthAwarePaginator
    {
        return Protocol::with('author')->latest()->paginate(10);
    }

    /**
     * Store a newly created protocol in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', new NotBadWord()],
            'content' => ['required', 'string', new NotBadWord()],
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
     * @return Protocol
     */
    public function update(Request $request, Protocol $protocol): Protocol
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255', new NotBadWord()],
            'content' => ['required', 'string', new NotBadWord()],
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

        return $protocol;
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

    /**
     * Search for protocols based on a query string.
     *
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function search(Request $request): LengthAwarePaginator
    {
        $request->validate(['q' => 'required|string']);
        return Protocol::search($request->q)
            ->options([
                'query_by' => 'title, content, tags',
            ])
            ->paginate(10);
    }
}
