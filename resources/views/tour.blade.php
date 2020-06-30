<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title></title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">

         <link rel="stylesheet" href="{{ mix('css/app.css') }}">
        <!-- Styles -->
       
    </head>
    <body style="background-color: #D7D7D9">
        <div id="app">
            <router-view />
        </div>
        
    </body>
    <footer class="footer mt-2">
        <div class="container d-flex align-items-center justify-content-between">
            <p class="mb-0"><a href="/">Powered by Camino</a></p>
            <p class="mb-0"><a href="https://umn-latis.github.io/Camino/">Get Help</a></p>
            <p class="mb-0">Built at the University of Minnesota</p>
        </div>
    </footer>
    <script>
    @auth
        window.Permissions = {!! json_encode(Auth::user()->allPermissions, true) !!};
    @else
        window.Permissions = [];
    @endauth
     window.mapbox = "{{ config('services.mapbox') }}";
    </script>
    <script src="{{ mix('/js/app.js') }}"></script>
</html>
