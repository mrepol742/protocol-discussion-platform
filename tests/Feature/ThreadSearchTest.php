<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Thread;
use App\Models\User;
use App\Models\Protocol;

class ThreadSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_thread_search_returns_results()
    {
        $user = User::factory()->create();

        $protocol = Protocol::factory()->create([
            'title' => 'Security API Thread',
        ]);

        Thread::factory()->create([
            'title' => 'Security API Thread',
            'protocol_id' => $protocol->id,
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/threads/search?q=Security');

        $response->assertOk();

        $response->assertJsonPath('0.title', 'Security API Thread');

        $this->assertCount(1, $response->json());
    }
}
