<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\Honeypot;
use App\Rules\NotBadWord;
use App\Rules\NotContainingUserInfo;
use App\Rules\NotDisposableEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    /**
     * Handle the registration request for a new user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', new NotBadWord()],
            'username' => [new Honeypot()],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                new NotDisposableEmail(),
            ],
            'password' => [
                'required',
                'string',
                Password::min(8)->mixedCase()->letters()->numbers()->uncompromised(),
                new NotContainingUserInfo(),
                'confirmed',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'error' => $validator->errors()->first(),
                ],
                422,
            );
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            // The password will be automatically hashed due to the cast in the User model
            'password' => $request->password,
        ]);

        return response()->json(
            [
                'message' => 'Registration successful',
                'user' => $user,
            ],
            200,
        );
    }
}
