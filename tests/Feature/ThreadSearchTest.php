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
            'content' => 'This protocol is about security APIs.',
        ]);

        Thread::factory()->create([
            'title' => 'Security API Thread',
            'body' => 'Discussion about security APIs.',
            'protocol_id' => $protocol->id,
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/threads/' . $protocol->id . '?q=Security+API+Thread');

        $response->assertOk();

        $response->assertJsonPath('data.0.title', 'Security API Thread');

        $this->assertGreaterThan(0, $response->json('data'));
    }
}
