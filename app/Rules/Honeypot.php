<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Honeypot implements Rule
{
    /**
     * Check if the given value is empty (honeypot field should be empty)
     */
    public function passes($attribute, $value)
    {
        return empty($value); // must be empty
    }

    /**
     * Get the validation error message.
     */
    public function message()
    {
        return 'Spam detected.';
    }
}
