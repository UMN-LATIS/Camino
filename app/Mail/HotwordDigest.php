<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class HotwordDigest extends Mailable
{
    use Queueable, SerializesModels;

    public $hotwords;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($hotwords)
    {
        $this->hotwords = $hotwords;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('mcfa0086@umn.edu')->view('emails.hotwords');
    }
}
