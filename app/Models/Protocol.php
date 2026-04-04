<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Protocol extends Model
{
    use Searchable, HasFactory;

    protected $fillable = ['title', 'content', 'tags', 'author_id', 'rating', 'votes_count'];

    protected $casts = [
        'tags' => 'array',
    ];

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->toArray(), [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'tags' => $this->tags ?? [],
            'votes' => $this->votes ?? 0,
        ]);
    }

    /**
     * Get the index name for the model.
     */
    public function searchableAs(): string
    {
        return 'protocols';
    }

    /**
     * Get the threads for the protocol.
     */
    public function threads(): HasMany
    {
        return $this->hasMany(Thread::class);
    }

    /**
     * Get the reviews for the protocol.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the author of the protocol.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
