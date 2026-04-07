<?php

namespace App\Console\Commands;

use App\Models\Protocol;
use App\Models\Thread;
use Illuminate\Console\Command;

class ReindexTypesense extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reindex-typesense {collection?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reindex data into Typesense collections';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $collection = $this->argument('collection');

        if (!$collection || $collection === 'protocols') {
            $this->info('Reindexing protocols...');
            Protocol::chunk(100, function ($protocols) {
                foreach ($protocols as $protocol) {
                    $protocol->searchable(); // Laravel Scout
                }
            });
            $this->info('Protocols reindexed.');
        }

        if (!$collection || $collection === 'threads') {
            $this->info('Reindexing threads...');
            Thread::chunk(100, function ($threads) {
                foreach ($threads as $thread) {
                    $thread->searchable();
                }
            });
            $this->info('Threads reindexed.');
        }

        $this->info('Reindexing completed.');
    }
}
