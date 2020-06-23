<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TourInvite extends Mailable
{
    use Queueable, SerializesModels;
    public $tour;
    public $tourURL;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\Tour $tour, $tourURL)
    {
        $this->tour = $tour;
        $this->tourURL = $tourURL;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('mcfa0086@umn.edu')->view('emails.invite');
    }
}
