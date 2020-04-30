@extends('base')

@section('content')

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
    <h1 class="display-4 font-weight-normal">Camino</h1>
    <p class="lead font-weight-normal">Guided tours, without the tour guide.</p>
    <a class="btn btn-outline-primary find-tours" href="/findTours"><i class="fas fa-search mr-2"></i>Find Tours Near Me</a>
  </div>
</div>
<div class="container callouts">
<div class="row">
      <div class="col-lg-4">
        <img src="/images/about.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
        <h2>About Camino</h2>
        <p>Why did we build Camino, and who is it for?</p>
        <p><a class="btn btn-secondary" href="/about" role="button">Learn More »</a></p>
      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4">
        <img src="/images/browse.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
        {{-- <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg> --}}
        <h2>Browse Tours</h2>
        <p>Find a tour near you, or go on a "virtual" tour anywhere in the world.</p>
        <p><a class="btn btn-secondary" href="/findTours" role="button">Explore Tours »</a></p>
      </div><!-- /.col-lg-4 -->
      <div class="col-lg-4">
        <img src="/images/create.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
        <h2>Build Yours</h2>
        <p>Anyone can create a tour with Camino.  Just log in and get started.</p>
        <p><a class="btn btn-secondary" href="/creator" role="button">View details »</a></p>
      </div><!-- /.col-lg-4 -->
    </div>
</div>
@endsection
