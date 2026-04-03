<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\Honeypot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /**
     * Handle login request and return a token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => [new Honeypot()],
            'email' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json(
                [
                    'message' => 'Invalid credentials',
                ],
                401,
            );
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(
            [
                'message' => 'Login successful',
                'token' => $token,
            ],
            200,
        );
    }
}
