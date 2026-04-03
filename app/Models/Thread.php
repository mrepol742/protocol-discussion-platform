<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Thread extends Model
{
    use Searchable, HasFactory;

    protected $fillable = ['title', 'body', 'protocol_id', 'user_id', 'votes_count'];

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->toArray(), [
            'id' => (string) $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'tags' => $this->protocol?->tags ?? [],
        ]);
    }

    /**
     * Get the index name for the model.
     */
    public function searchableAs(): string
    {
        return 'threads';
    }

    /**
     * Get the protocol that owns the thread.
     */
    public function protocol(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Protocol::class);
    }

    /**
     * Get the comments for the thread.
     */
    public function comments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the votes for the thread.
     */
    public function votes(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }
}
