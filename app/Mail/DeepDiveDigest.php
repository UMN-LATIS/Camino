<?php

namespace App\Mail;

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
    public function __construct($deepdives)
    {
        $this->deepdives = $deepdives;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('mcfa0086@umn.edu')->view('emails.deepdives');
    }
}
