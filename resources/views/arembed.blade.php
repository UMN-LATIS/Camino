<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script
        src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1c2407b26c61958baa93967b5412487cd94b290b/dist/aframe-master.min.js">
        </script>
      <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
        <script src="/aframe-ar.min.js"></script>
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
            <ar-embed stage="{{$stage}}" simulate-location="{{$simulateLocation}}" locale="{{$locale}}" tour-id="{{$tour->id}}"></ar-embed>
        </div>
        
    </body>
    <script src="{{ mix('/js/app.js') }}"></script>
    
</html>
