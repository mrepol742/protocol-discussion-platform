<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider('groq')]
class ReviewSummarizer implements Agent, Conversational, HasTools
{
    use Promptable;

    protected array $reviews;

    /**
     * Create a new ReviewSummarizer instance.
     */
    public function __construct(array $reviews)
    {
        $this->reviews = $reviews;
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'You summarize user feedback into a concise, neutral 3-5 sentence summary. Highlight recurring themes, major positives, major negatives, and overall sentiment. If there is not enough information to create a summary, say "Not enough information to summarize."';
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        $allReviewsText = implode("\n\n", $this->reviews);

        return [new Message('user', "{$allReviewsText}")];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }
}
