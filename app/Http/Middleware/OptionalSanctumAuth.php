<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OptionalSanctumAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Attempt to authenticate using Sanctum
        try {
            Auth::shouldUse('sanctum'); // force Sanctum guard
            Auth::authenticate(); // tries to log in user if token is present
        } catch (\Exception $e) {
            // Do nothing if authentication fails
            // Guest users will have auth()->check() === false
        }

        return $next($request);
    }
}
