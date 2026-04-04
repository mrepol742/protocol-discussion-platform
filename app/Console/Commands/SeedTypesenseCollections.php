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
                'api_key' => env('TYPESENSE_API_KEY'),
                'nodes' => [
                    [
                        'host' => env('TYPESENSE_HOST'),
                        'port' => env('TYPESENSE_PORT'),
                        'protocol' => env('TYPESENSE_PROTOCOL'),
                    ],
                ],
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
                        ['name' => 'votes', 'type' => 'int32'],
                    ],
                    'default_sorting_field' => 'votes',
                ]);
                $this->info('Collection "protocols" created.');
            } catch (ObjectAlreadyExists $e) {
                $this->info('Collection "protocols" already exists.');
            }

            // Seed threads collection
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
                $this->info('Collection "threads" created.');
            } catch (ObjectAlreadyExists $e) {
                $this->info('Collection "threads" already exists.');
            }

            $this->info('Typesense seeding completed successfully.');
        }
}
