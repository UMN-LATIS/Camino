<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Tour;

class DeepDiveDigest extends Mailable
{
    use Queueable, SerializesModels;

    public $deepdives;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($deepdives, $locale = Tour::LOCALE_EN)
    {
        $this->deepdives = $deepdives;
        $this->locale = $locale;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $localizedDeepDives = collect($this->deepdives)
            ->map(function ($deepdive) {
                return [
                    'title' => $deepdive->title[$this->locale],
                    'text' => $deepdive->text[$this->locale]
                ];
            });

        return $this
            ->from('latistecharch@umn.edu')
            ->view('emails.deepdives')->with([
                'deepdives' => $localizedDeepDives
            ]);
    }
}
