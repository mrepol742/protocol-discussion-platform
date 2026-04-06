<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Comment;
use App\Models\Protocol;
use App\Models\Review;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([TypesenseSeeder::class]);

        User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $protocols = Protocol::factory(12)->create();
        $threads = Thread::factory(10)->create();

        /**
         * Create comments
         */
        $threads->each(function ($thread) {
            $comments = Comment::factory(rand(3, 6))->create([
                'thread_id' => $thread->id,
                'body' => fake()->paragraph(),
            ]);

            // Add replies
            foreach ($comments as $comment) {
                Comment::factory(rand(1, 3))->create([
                    'thread_id' => $thread->id,
                    'parent_id' => $comment->id,
                ]);
            }
        });

        /**
         * Create reviews
         */
        $users = User::all();

        foreach ($protocols as $protocol) {
            $users->random(rand(3, 6))->each(function ($user) use ($protocol) {
                Review::factory()->create([
                    'protocol_id' => $protocol->id,
                    'user_id' => $user->id,
                    'rating' => rand(1, 5),
                    'feedback' => fake()->sentence(),
                ]);
            });
        }

        /**
         * Create votes
         */
        foreach ($threads as $thread) {
            $users->random(rand(3, 6))->each(function ($user) use ($thread) {
                Vote::factory()->create([
                    'user_id' => $user->id,
                    'votable_id' => $thread->id,
                    'votable_type' => Thread::class,
                ]);
            });

            foreach ($thread->comments as $comment) {
                $users->random(rand(2, 4))->each(function ($user) use ($comment, $thread) {
                    Vote::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'votable_id' => $thread->id,
                            'votable_type' => Thread::class,
                        ],
                        [
                            'is_upvote' => fake()->boolean(),
                        ],
                    );
                });
            }
        }
    }
}
