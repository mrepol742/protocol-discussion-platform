<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Thread>
 */
class ThreadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'body' => $this->faker->paragraph(),
            'protocol_id' => Protocol::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
        ];
    }
}
