<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Typesense\Client;
use Typesense\Exceptions\ObjectAlreadyExists;

class TypesenseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $client = new Client([
            'api_key' => config('scout.typesense.client-settings.api_key'),
            'nodes' => config('scout.typesense.client-settings.nodes'),
        ]);

        try {
            $client->collections['protocols']->delete();
            $client->collections['threads']->delete();
        } catch (\Exception $e) {
            // ignore if not found
        }

        // Protocols collection
        try {
            $client->collections->create([
                'name' => 'protocols',
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'content', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'facet' => true],
                    ['name' => 'reviews_count', 'type' => 'int32'],
                    ['name' => 'average_rating', 'type' => 'float'],
                    ['name' => 'votes_count', 'type' => 'int32'],
                    ['name' => 'author_id', 'type' => 'string'],
                    ['name' => 'author_name', 'type' => 'string'],
                    ['name' => 'created_at', 'type' => 'int64'],
                    ['name' => 'updated_at', 'type' => 'int64'],
                ],
            ]);
        } catch (ObjectAlreadyExists $e) {
        }

        // Threads collection
        try {
            $client->collections->create([
                'name' => 'threads',
                'enable_nested_fields' => true,
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'body', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'facet' => true],
                    ['name' => 'votes_count', 'type' => 'int32'],
                    ['name' => 'votes', 'type' => 'object[]'],
                    ['name' => 'protocol_id', 'type' => 'string'],
                    ['name' => 'created_at', 'type' => 'int64'],
                    ['name' => 'updated_at', 'type' => 'int64'],
                ],
            ]);
        } catch (ObjectAlreadyExists $e) {
        }
    }
}
