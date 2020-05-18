<?php

namespace App\Http\Controllers;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use App\Tour;
use App\Stop;
use Illuminate\Http\Request;
use Auth;
use App\Http\Resources\Tour as TourResource;

class TourEditController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        
        if($req->ajax()){
            return response()->json(TourResource::collection(Auth::user()->tours));
        }
        return view("edit.index");
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
        $tour->user()->associate(Auth::user());
        $request = $request->all();
        if($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
        } 
        
        if(!Auth::user()->can("publish publicly")) {
            $request["public"] = false;
        }

        $tour->fill($request);
        $tour->save();

        $template = Tour::where("template", true)->first();
        $startContent = $template->stops->first();
        $endContent = $template->stops->last();

        $stop = new Stop;
        $stop->stop_content = $startContent->stop_content;
        $stop->sort_order = 0;
        $tour->stops()->save($stop);


        $stop = new Stop;
        $stop->stop_content = $endContent->stop_content;
        $stop->sort_order = 1;
        $tour->stops()->save($stop);
        $tour->load("stops");
        return response()->json($tour);
    }

    public function createStop(Request $request, Tour $tour)
    {
        $this->authorize('update', $tour);
        $stop = new Stop;
        $stop->fill($request->all());
        $sortOrder = $tour->stops->pluck("sort_order")->toArray();
        // we should always have a finish
        if(count($sortOrder) == 0) {
            $stop->sort_order = 0;
        }
        else {
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
        if($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
            if($request["start_location"] != $tour->start_location) {
                $locationDirty = true;
            }
        } 
        
        if(!Auth::user()->can("publish publicly")) {
            $request["public"] = false;
        }

        $tour->fill($request);

        if($locationDirty){
            $geocoded = app('geocoder')->reverse($tour->start_location->getLat(), $tour->start_location->getLng())->get();
            if($geocoded) {
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


        for($i=0; $i<count($request["stops"]); $i++) {
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

    public function deleteStop(Request $request, Tour $tour, Stop $stop) {
        $this->authorize('delete', $tour);
        $stop->delete();
    }

    public function getFeedback(Request $request, Tour $tour) {
        $this->authorize('viewFeedback', $tour);
        return response()->json($tour->feedback);
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
