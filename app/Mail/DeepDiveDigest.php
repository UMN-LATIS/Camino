<?php

namespace App\Mail;

use App\Tour;
use App\Http\Requests\TourDeepDiveEmailRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeepDiveDigest extends Mailable
{
    use Queueable, SerializesModels;

    public $deepdives;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Tour $tour, TourDeepDiveEmailRequest $request)
    {
        $this->tour = $tour;
        $this->deepdiveIds = $request['deepdiveIds'];
        $this->locale = $request['locale'];
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $deepdives = $this->tour->getDeepDives($this->deepdiveIds);

        $localizedDeepDives = $deepdives
            ->map(fn ($deepdive) => [
                'title' => $deepdive['title'][$this->locale],
                'text' => $deepdive['text'][$this->locale]
            ]);


        return $this
            ->from('latistecharch@umn.edu')
            ->markdown('emails.deepdives', [
                'localizedDeepDives' => $localizedDeepDives,
                'tour' => $this->tour,
                'tour_url' => config('app.url') . "/trekker/tours/{$this->tour->id}"
            ]);
    }
}
