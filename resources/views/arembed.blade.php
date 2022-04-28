<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
  <script>
    THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  </script>
  <title></title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
  <link rel="stylesheet" href="{{ mix('css/app.css') }}">
  <!-- Styles -->

</head>

<body>
  <div id="app" style="width:100%; height:100%">
    <ArEmbed stage="{{ $stage }}" simulate-location="{{ $simulateLocation }}" locale="{{ $locale }}"
      tour-id="{{ $tour->id }}"></ArEmbed>
  </div>

</body>
<script src="{{ mix('/js/app.js') }}"></script>

</html>
