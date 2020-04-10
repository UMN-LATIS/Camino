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
         <link rel="stylesheet" href="{{ mix('css/edit.css') }}">
        <!-- Styles -->
       
    </head>
    <body>
        <div id="app">
            <router-view />
        </div>
        
    </body>
    <script src="{{ mix('/js/edit.js') }}"></script>
</html>