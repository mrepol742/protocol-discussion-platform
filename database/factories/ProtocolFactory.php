<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Protocol>
 */
class ProtocolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(6),
            'content' => $this->faker->paragraphs(3, true),
            'tags' => $this->faker->randomElements(
                ['security', 'api', 'auth', 'blockchain', 'network', 'ai'],
                rand(2, 4),
            ),
            'author_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'rating' => $this->faker->randomFloat(1, 2, 5),
        ];
    }
}
