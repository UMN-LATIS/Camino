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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $tour = new Tour;
        $tour->user()->associate(Auth::user());
        $request = $request->all();
        if($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
        } 
        
        $tour->fill($request);
        $tour->save();
        return response()->json($tour);
    }

    public function createStop(Request $request, Tour $tour)
    {
        $stop = new Stop;
        $stop->fill($request->all());
        $sortOrder = $tour->stops->pluck("sort_order")->toArray();
        if(count($sortOrder) == 0) {
            $stop->sort_order = 0;
        }
        else {
            $stop->sort_order = max($tour->stops->pluck("sort_order")->toArray()) + 1;
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
        return new TourResource($tour);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Tour  $tour
     * @return \Illuminate\Http\Response
     */
    public function edit(Tour $tour)
    {
        //
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
        $request = $request->all();
        if($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
        } 
        
        $tour->fill($request);
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
        $stop->fill($request->all());
        $stop->save();
        return response()->json($stop);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Tour  $tour
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tour $tour)
    {
        //
    }
}
