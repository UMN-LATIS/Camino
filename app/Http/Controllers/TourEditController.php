<?php

namespace App\Http\Controllers;

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
        $tour->fill($request->all());
        $tour->save();
        return response()->json($tour);
    }

    public function createStop(Request $request, Tour $tour)
    {
        $stop = new Stop;
        $stop->fill($request->all());
        $stop->sort_order = max($tour->stops->pluck("sort_order")->toArray()) + 1;

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
        $tour->fill($request->all());
        $tour->save();
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
