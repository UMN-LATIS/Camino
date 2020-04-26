<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Tour;
use App\Http\Resources\Tour as TourResource;
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
        return view('welcome');
    }

    public function loadTour(Tour $tour) {
        if($this->authorize('view', $tour)) {
            return new TourResource($tour);
        }
        
    }

    public function ar($stage,$locale = "en", $simulateLocation=false) {
        return view('arembed', ["stage"=>$stage, "simulateLocation"=>$simulateLocation, "locale"=> $locale]);
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
    
}
