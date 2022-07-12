<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Tour;
use App\Stop;
use App\Mail\DeepDiveDigest;
use Illuminate\Support\Facades\Mail;

class TourDeepDivesEmailController extends Controller
{

    /**
     * Available Tour Languages - probably should go elsewhere
     */


    /**
     * email selected tour deep dives
     */
    public function __invoke(Request $request, Tour $tour)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'deepdiveIds' => ['required', 'array'],
            'deepdiveIds.*' => 'uuid',
            'locale' => [
                'required',
                Rule::in(Tour::possibleLocales())
            ],
        ]);

        $deepDiveStages = $tour->stops
            // all tour stages
            ->flatMap(fn (Stop $stop) => $stop->stop_content['stages'])
            // deepdive stages
            ->filter(fn ($stage) => $stage['type'] === 'deepdives');

        $tourDeepDives = $deepDiveStages->flatMap(fn ($deepDiveStage) => $deepDiveStage['deepdives']);

        $selectedDeepDives = $tourDeepDives->filter(fn ($deepdive) => collect($validated['deepdiveIds'])->contains($deepdive['id']));


        $digest = new DeepDiveDigest($selectedDeepDives, $validated['locale']);

        Mail::to($validated['email'])->send($digest);
    }
}
