<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Typesense\Client;

class ClearTypesenseCollections extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-typesense-collections';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all collections in Typesense';

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

        try {
            $collections = $client->collections->retrieve();
            if (empty($collections)) {
                $this->info('No collections found.');
                return 0;
            }

            foreach ($collections as $collection) {
                $client->collections[$collection['name']]->delete();
                $this->info("Deleted collection: {$collection['name']}");
            }

            $this->info('All Typesense collections cleared successfully.');
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
        }

        return 0;
    }
}
