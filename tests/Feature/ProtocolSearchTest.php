<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Protocol;

class ProtocolSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_protocol_search_returns_results()
    {
        Protocol::factory()->create([
            'title' => 'Security API Protocol',
            'content' => 'This protocol is about security APIs.',
            'tags' => ['security', 'api'],
        ]);

        $response = $this->getJson('/api/protocols/search?q=Security');

        $response->assertOk();

        $response->assertJsonPath('data.0.title', 'Security API Protocol');

        $this->assertCount(1, $response->json('data'));
    }
}
