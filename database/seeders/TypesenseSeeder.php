<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Typesense\Client;
use Typesense\Exceptions\ObjectAlreadyExists;

class TypesenseSeeder extends Seeder
{
    public function run()
    {
        $client = new Client([
            'api_key' => env('TYPESENSE_API_KEY'),
            'nodes' => [
                [
                    'host' => env('TYPESENSE_HOST'),
                    'port' => env('TYPESENSE_PORT'),
                    'protocol' => env('TYPESENSE_PROTOCOL'),
                ],
            ],
        ]);

        // Protocols collection
        try {
            $client->collections->create([
                'name' => 'protocols',
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'content', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'facet' => true],
                    ['name' => 'votes', 'type' => 'int32'],
                ],
                'default_sorting_field' => 'votes',
            ]);
        } catch (ObjectAlreadyExists $e) {
        }

        // Threads collection
        try {
            $client->collections->create([
                'name' => 'threads',
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'body', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'facet' => true],
                ],
            ]);
        } catch (ObjectAlreadyExists $e) {
        }
    }
}
