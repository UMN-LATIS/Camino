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
    {{-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"> --}}
    <link rel="stylesheet" href="{{ mix('css/edit.css') }}">
    <!-- Styles -->
    
</head>
<body>
    <main>
    <div id="app" >
        <find-tour />
    </div>
    </main>
    <footer class="footer mt-2">
        <div class="container d-flex align-items-center justify-content-between">
            <p class="mb-0">
                <a href="#">Back to top</a>
            </p>
            <p class="mb-0">Camino Footer</p>

        </div>
    </footer>
    
</body>

<script src="{{ mix('/js/app.js') }}"></script>
</html>
