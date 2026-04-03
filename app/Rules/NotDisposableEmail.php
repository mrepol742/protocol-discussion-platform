<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class NotDisposableEmail implements Rule
{
    protected $domain;

    /**
     * Check if the email is valid (not disposable).
     */
    public function passes($attribute, $value)
    {
        $this->domain = strtolower(substr(strrchr($value, '@'), 1));

        // Cache the blocklist for 6 hours
        $blocklist = Cache::remember('disposable_email_blocklist', 60 * 6, function () {
            $url =
                'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/disposable_email_blocklist.conf';
            $response = Http::get($url);
            if ($response->ok()) {
                // Remove empty lines and comments
                return collect(explode("\n", $response->body()))
                    ->map(fn($line) => trim($line))
                    ->reject(fn($line) => empty($line) || str_starts_with($line, '#'))
                    ->all();
            }
            return [];
        });

        return !in_array($this->domain, $blocklist);
    }

    /**
     * Get the validation error message.
     */
    public function message()
    {
        return 'Disposable email addresses are not allowed.';
    }
}
