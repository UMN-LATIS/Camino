<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CaminoTrekkerController extends Controller
{
  public function index()
  {
    return view('camino-trekker.index');
  }
}
