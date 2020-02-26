<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('welcome');
    }

    public function ar($stage,$locale = "en", $simulateLocation=false) {
        return view('arembed', ["stage"=>$stage, "simulateLocation"=>$simulateLocation, "locale"=> $locale]);
    }
}
