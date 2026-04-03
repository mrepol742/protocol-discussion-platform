<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NotBadWord implements Rule
{
    protected $badwords;

    public function __construct()
    {
        $this->badwords = config('badwords');
    }

    /**
     * Check if the given value contains any bad words
     */
    public function passes($attribute, $value)
    {
        $valueLower = strtolower($value);

        foreach ($this->badwords as $word) {
            if (str_contains($valueLower, $word)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     */
    public function message()
    {
        return 'This :attribute contains prohibited words.';
    }
}
