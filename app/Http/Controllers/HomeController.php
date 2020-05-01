<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Tour;
use App\Feedback;


use App\Http\Resources\Tour as TourResource;
use Illuminate\Support\Facades\Mail;
use App\Mail\HotwordDigest;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('index');
    }

    public function tour() {
        return view ("tour");
    }

    public function about() {
        return view ("about");
    }

    public function findTours() {
        return view ("findTours");
    }

    public function loadTours() {
        $tours = Tour::where("active", 1)->where("public", 1)->get();
        return TourResource::collection($tours);
    }

    public function loadTour(Tour $tour) {
        if($this->authorize('view', $tour)) {
            return new TourResource($tour);
        }
        
    }

    public function ar(Tour $tour, $stage,$locale = "en", $simulateLocation=false) {
        return view('arembed', ["tour"=>$tour, "stage"=>$stage, "simulateLocation"=>$simulateLocation, "locale"=> $locale]);
    }

    public function login()
    {
        return view('auth.login');
    }
    
    public function logout()
    {
        Auth::logout();
        return redirect("/");
    }
    
    public function emailHotwords(Request $request) {
        Mail::to($request->input("email"))->send(new HotwordDigest($request->input("hotwords")));
    }

    public function storeFeedback(Tour $tour, Request $request) {
        $feedback = new Feedback($request->all());
        $feedback->tour()->associate($tour);
        $feedback->save();

    }

}
