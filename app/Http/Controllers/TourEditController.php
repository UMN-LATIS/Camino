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

        $stop = new Stop;
        $stop->stop_content = json_decode('{
    "title": {
        "English": "Finish",
        "placeholder": null
    },
    "stages": [
        {
            "text": {
                "English": "Finish"
            },
            "type": "separator"
        },
        {
            "text": {
                "placeholder": null
            },
            "type": "guide"
        },
        {
            "text": {
                "placeholder": null,
                "English": "Enter your email below to have your hotwords emailed to you."
            },
            "type": "hotwords-summary"
        }
    ]
}');
        $stop->sort_order = 0;
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
        if($request["start_location"]) {
            $request["start_location"] = new Point($request["start_location"]["lat"], $request["start_location"]["lng"]);
        } 
        
        if(!Auth::user()->can("publish publicly")) {
            $request["public"] = false;
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
        $this->authorize('update', $tour);
        $stop->fill($request->all());
        $stop->save();
        return response()->json($stop);
    }

    public function deleteStop(Request $request, Tour $tour, Stop $stop) {
        $this->authorize('delete', $tour);
        $stop->delete();
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
