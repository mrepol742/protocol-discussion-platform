<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'protocol_id' => Protocol::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'feedback' => $this->faker->optional()->sentence(),
        ];
    }
}
