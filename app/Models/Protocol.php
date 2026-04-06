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
        $this->loadMissing(['author', 'threads', 'reviews']);

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'tags' => $this->tags ?? [],
            'reviews_count' => $this->reviews()->count(),
            'average_rating' => (float) $this->reviews()->avg('rating'),
            'votes_count' => (int) $this->threads()->sum('votes_count'),
            'author_id' => (string) $this->author_id,
            'author_name' => $this->author?->name,
            'created_at' => strtotime($this->created_at),
            'updated_at' => strtotime($this->updated_at),
        ];
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
