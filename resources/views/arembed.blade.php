<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>AR Embed | Camino</title>
  @vite(['resources/sass/app.scss', 'resources/js/app.ts'])

</head>

<body>
  <div id="app" style="width:100%; height:100%">
    <ar-embed stage="{{ $stage }}" simulate-location="{{ $simulateLocation }}" locale="{{ $locale }}"
      tour-id="{{ $tour->id }}"></ar-embed>
  </div>

</body>

</html>
