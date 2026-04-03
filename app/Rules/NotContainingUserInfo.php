<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NotContainingUserInfo implements Rule
{
    /**
     * Check if the given value does not contain the user's name or email username.
     */
    public function passes($attribute, $value)
    {
        $name = strtolower(request('name'));
        $email = strtolower(request('email'));
        $emailUser = explode('@', $email)[0];

        $value = strtolower($value);

        return !str_contains($value, $name) && !str_contains($value, $emailUser);
    }

    /**
     * Get the validation error message.
     */
    public function message()
    {
        return 'The password must not contain your name or email.';
    }
}
