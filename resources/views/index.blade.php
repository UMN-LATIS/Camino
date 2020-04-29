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

    <style>
.camino-backdrop {
  /* width: 100%; */
  /* height: 200px; */
  /* display: block; */
  position: relative;
}
    .camino-backdrop::after {
        content: "";
        background: url("/images/camino-backdrop.jpg");
        background-position: center; 
        background-repeat: no-repeat;
        background-size: 100%;
        opacity: 0.8;
         top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 0;   
    }

.camino-inset {
    background-color: rgba(255,255,255,0.9);
    opacity: 1;
    z-index: 1;
}

.find-tours {
    opacity: 1;
    background-color: rgba(255,255,255,1);


}

.callouts {
    text-align: center;
}
    </style>



<div class="position-relative overflow-hidden p-3 p-md-5 mb-3 text-center bg-light camino-backdrop">
  <div class="col-md-5 p-lg-5 mx-auto my-5 camino-inset">
    <h1 class="display-4 font-weight-normal">Camino: </h1>
    <p class="lead font-weight-normal">Guided tours, without the tour guide.</p>
    <a class="btn btn-outline-primary find-tours" href="/findTours"><i class="fas fa-search mr-2"></i>Find Tours Near Me</a>
  </div>
</div>
<div class="container callouts">
<div class="row">
      <div class="col-lg-4">
        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
        <h2>About Camino</h2>
        <p>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.</p>
        <p><a class="btn btn-secondary" href="#" role="button">View details »</a></p>
      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4">
        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
        <h2>Browse Tours</h2>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.</p>
        <p><a class="btn btn-secondary" href="#" role="button">View details »</a></p>
      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4">
        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
        <h2>Build Yours</h2>
        <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
        <p><a class="btn btn-secondary" href="#" role="button">View details »</a></p>
      </div><!-- /.col-lg-4 -->
    </div>
</div>

    <footer class="footer mt-2">
        <div class="container d-flex align-items-center justify-content-between">
            <p class="mb-0">
                <a href="#">Back to top</a>
            </p>
            <p class="mb-0">Camino Footer</p>
        </div>
    </footer>
    
</body>
