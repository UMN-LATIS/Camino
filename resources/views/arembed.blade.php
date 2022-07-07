<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>

  <title></title>

  <!-- Fonts -->
  @vite('resources/css/app.css')
  <!-- Styles -->

</head>

<body>
  <div id="app" style="width:100%; height:100%">
    <ar-embed stage="{{ $stage }}" simulate-location="{{ $simulateLocation }}" locale="{{ $locale }}"
      tour-id="{{ $tour->id }}"></ar-embed>
  </div>

</body>
@vite('resources/js/app.js')
<script>
  THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
</script>
</html>
