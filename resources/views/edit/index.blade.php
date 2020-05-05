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
    <header>
    <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
        <h5 class="my-0 mr-md-auto font-weight-normal"><a class="text-reset" href="/">Camino</a></h5>
        <nav class="my-2 my-md-0 mr-md-3">
            <a class="p-2 text-dark" href="/creator">My Tours</a>
            @impersonating
            <a class="" href="/impersonate/leave">End Impersonation</a>
            @endImpersonating
        </nav>
        @if (Auth::user())
        <a class="btn btn-outline-primary" href="/logout">Sign Out</a>
        @endif
    </div>
    </header>
    <main>
    <div id="app" class="container">
        <router-view />
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
<script>
  @auth
    window.Permissions = {!! json_encode(Auth::user()->allPermissions, true) !!};
  @else
    window.Permissions = [];
  @endauth
</script>
<script src="{{ mix('js/edit.js') }}"></script>

</html>
