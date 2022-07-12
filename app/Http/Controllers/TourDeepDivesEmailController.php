<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Tour;
use App\Stop;
use App\Mail\DeepDiveDigest;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\TourDeepDiveEmailRequest;

class TourDeepDivesEmailController extends Controller
{

    /**
     * email selected tour deep dives
     */
    public function __invoke(Tour $tour, TourDeepDiveEmailRequest $request)
    {

        $a = 1 + 1;
        $digest = new DeepDiveDigest($tour, $request);

        Mail::to($request['email'])->send($digest);

        return response()->json([
            'success' => true,
        ]);
    }
}
