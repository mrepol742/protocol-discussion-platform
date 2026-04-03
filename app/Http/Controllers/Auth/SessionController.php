<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * Verify if the current token is valid
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifySession(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user && $user->status === 'active') {
            return response()->json(
                [
                    'message' => 'Session is active',
                    'user' => $user,
                ],
                200,
            );
        }

        return response()->json(
            [
                'message' => 'Session is inactive or invalid',
            ],
            401,
        );
    }

    /**
     * Logout (revoke current token)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // delete ONLY current token
            $user->currentAccessToken()->delete();
        }

        return response()->json(
            [
                'message' => 'Logout successful',
            ],
            200,
        );
    }
}
