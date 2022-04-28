<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Camino | Educational Tours for Everybody</title>
  <link rel="stylesheet" href="{{ mix('/css/camino-trekker.css') }}">
</head>

<body>
  <div id="modals"></div>
  <div id="app"></div>
  <script>
    @auth
      window.Permissions = {!! json_encode(Auth::user()->allPermissions, true) !!};
    @else
      window.Permissions = [];
    @endauth
  </script>
  <script src="{{ mix('/js/camino-trekker.js') }}"></script>
</body>

</html>
