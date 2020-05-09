@extends('base')

@section('content')

    <div id="app" >
        <site-nav current-route={{ Route::current()->uri() }}></site-nav>
        <find-tour></find-tour>
    </div>

@endsection
