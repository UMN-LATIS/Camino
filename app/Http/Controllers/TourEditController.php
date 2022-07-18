<?php

namespace App\Http\Controllers;

use MatanYadaev\EloquentSpatial\Objects\Point;
use App\Tour;
use App\Stop;
use Illuminate\Http\Request;
use Auth;
use App\Http\Resources\TourResource;
use Illuminate\Support\Facades\Mail;
use App\Mail\TourInvite;

class TourEditController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {

        if ($req->ajax()) {
            return response()->json(TourResource::collection(Auth::user()->tours));
        }
        return view("camino-creator.index");
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Tour::class);

        $tour = new Tour;

        $request = $request->all();
        if ($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
        }

        if (!Auth::user()->can("publish publicly")) {
            $request["public"] = $tour->public ?? false;
        }


        $tour->fill($request);
        $tour->save();
        $tour->users()->attach(Auth::user());
        $tour->save();

        if ($tour->tour_content["use_template"]) {
            $template = Tour::where("template", true)->first();

            $clonedFirstStop = $template->stops->first()->clone();
            $clonedFirstStop->sort_order = 0;
            $tour->stops()->save($clonedFirstStop);

            $clonedLastStop = $template->stops->last()->clone();
            $clonedLastStop->sort_order = 1;
            $tour->stops()->save($clonedLastStop);
        }

        $tour->load("stops");

        return new TourResource($tour);
    }

    public function createStop(Request $request, Tour $tour)
    {
        $this->authorize('update', $tour);
        $stop = new Stop;
        $stop->fill($request->all());
        $sortOrder = $tour->stops->pluck("sort_order")->toArray();
        // we should always have a finish
        if (count($sortOrder) == 0) {
            $stop->sort_order = 0;
        } else {
            $finish = $tour->stops->last();
            // remove the "end" item - we don't let them make that not the end.
            $stop->sort_order = max($tour->stops->pluck("sort_order")->toArray());
            $finish->sort_order = $stop->sort_order + 1;
            $finish->save();
        }


        $tour->stops()->save($stop);

        return response()->json($stop);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Tour  $tour
     * @return \Illuminate\Http\Response
     */
    public function show(Tour $tour)
    {
        $this->authorize('view', $tour);
        return new TourResource($tour);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Tour  $tour
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tour $tour)
    {
        $this->authorize('update', $tour);
        $request = $request->all();
        $locationDirty = false;
        if (isset($request["start_location"])) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
            if ($request["start_location"] != $tour->start_location) {
                $locationDirty = true;
            }
        }

        if (!Auth::user()->can("publish publicly")) {
            $request["public"] = $tour->public;
        }

        $tour->fill($request);

        if ($locationDirty) {
            $geocoded = app('geocoder')->reverse($tour->start_location->latitude, $tour->start_location->longitude)->get();
            if ($geocoded) {
                $firstGeocode = $geocoded[0];
                $neighborhood = $firstGeocode->getNeighborhood();
                $locality = $firstGeocode->getLocality();
                $postalCode = $firstGeocode->getPostalCode();
                $country = $firstGeocode->getCountry()->getName();
                $adminLevels = $firstGeocode->getAdminLevels();
                $city = $adminLevels->get(1)->getName();
                $state = $adminLevels->get(2)->getName();
                $tour->geocoded = ["neighborhood" => $neighborhood, "locality" => $locality, "postalCode" => $postalCode, "country" => $country, "city" => $city, "state" => $state];
            }
        }
        $tour->save();


        for ($i = 0; $i < count($request["stops"]); $i++) {
            $stop = $request["stops"][$i];
            $loadedStop = Stop::find($stop["id"]);
            $loadedStop->sort_order = $i;
            $loadedStop->save();
        }

        return response()->json($tour);
    }

    public function updateStop(Request $request, Tour $tour, Stop $stop)
    {
        $this->authorize('update', $tour);
        $stop->fill($request->all());
        $stop->save();
        return response()->json($stop);
    }

    public function deleteStop(Request $request, Tour $tour, Stop $stop)
    {
        $this->authorize('delete', $tour);
        $stop->delete();
    }

    public function getFeedback(Request $request, Tour $tour)
    {
        $this->authorize('viewFeedback', $tour);
        return response()->json($tour->feedback);
    }


    public function shareTour(Request $request, Tour $tour)
    {
        $this->validate($request, [
            'email' => 'required|email',
            // 'description' => 'required'
        ]);

        $tourURL = url("/creator/" . $tour->id . "/join/" . sha1($request->input("email") . $tour->id));

        Mail::to($request->input("email"))->send(new TourInvite($tour, $tourURL));
        return response()->json(["success" => "success"]);
    }

    public function joinTour(Tour $tour, $tourCode)
    {
        if (sha1(Auth::user()->email . $tour->id) == $tourCode) {
            $tour->users()->attach(Auth::user());
            $tour->save();
            return redirect("/creator/tours/" . $tour->id);
        } else {
            abort(403, 'Access denied');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Tour  $tour
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tour $tour)
    {
        $this->authorize('delete', $tour);
        $tour->delete();
    }
}
