<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Typesense\Client;
use Typesense\Exceptions\ObjectAlreadyExists;

class SeedTypesenseCollections extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-typesense-collections';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed Typesense collections: protocols and threads';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $client = new Client([
            'api_key' => config('scout.typesense.client-settings.api_key'),
            'nodes' => config('scout.typesense.client-settings.nodes'),
        ]);

        // Seed protocols collection
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
            $this->info('Collection "protocols" created.');
        } catch (ObjectAlreadyExists $e) {
            $this->info('Collection "protocols" already exists.');
        }

        // Seed threads collection
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
            $this->info('Collection "threads" created.');
        } catch (ObjectAlreadyExists $e) {
            $this->info('Collection "threads" already exists.');
        }

        $this->info('Typesense collections seeding completed.');
    }
}
