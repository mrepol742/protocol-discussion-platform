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
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'tags' => $this->protocol?->tags ?? [],
            'votes_count' => (int) $this->votes_count,
            'votes' => $this->votes()
                ->get()
                ->map(function (Vote $vote) {
                    return [
                        'user_id' => (string) $vote->user_id,
                        'votable_id' => (string) $vote->votable_id,
                        'votable_type' => $vote->votable_type,
                        'is_upvote' => (bool) $vote->is_upvote,
                    ];
                })
                ->toArray(),
            'protocol_id' => (string) $this->protocol_id,
            'created_at' => strtotime($this->created_at),
            'updated_at' => strtotime($this->updated_at),
        ];
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
