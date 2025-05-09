@extends('base')

@section('content')
  <style>
    .camino-backdrop {
      position: relative;
    }

    .camino-backdrop::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: url("/images/camino-backdrop.jpg");
      background-size: cover;
      opacity: 0.8;
    }

    .camino-inset {
      position: relative;
      background-color: rgba(255, 255, 255, 0.9);
    }

    .find-tours {
      opacity: 1;
      background-color: rgba(255, 255, 255, 1);
    }

    .callouts {
      text-align: center;
    }

    .home-page .btn-outline-primary {
      --btn-color: #bf7b3f;
      color: var(--btn-color);
      border-color: var(--btn-color);
    }

    .home-page .btn-outline-primary:hover {
      background: var(--btn-color);
      color: #fff;
    }
  </style>

  <div id="app">
    <div class="home-page">
      <div class="position-relative overflow-hidden p-md-5 mb-3 text-center bg-light camino-backdrop">
        <div class="col-md-5 p-lg-5 p-4 mx-auto my-md-5 my-4 camino-inset" data-cy="home-page-hero">
          <h1 class="display-4 fw-normal">Camino</h1>
          <p class="lead fw-normal">Guided tours, without the tour guide.</p>
          <a class="btn btn-outline-primary find-tours" href="/findTours"><i class="fas fa-search me-2"></i>Find Tours Near
            Me</a>
        </div>
      </div>
      <div class="container callouts">
        <div class="row">
          <div class="col-lg-4">
            <img src="/images/about.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
            <h2>About Camino</h2>
            <p>Why did we build Camino, and who is it for?</p>
            <p><a class="btn btn-outline-primary" href="/about" role="button">Learn More »</a></p>
          </div><!-- /.col-lg-4 -->
          <div class="col-lg-4">
            <img src="/images/browse.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
            <h2>Browse Tours</h2>
            <p>Find a tour near you, or go on a "virtual" tour anywhere in the world.</p>
            <p><a class="btn btn-outline-primary" href="/findTours" role="button" data-cy="find-tour-link">Explore Tours
                »</a></p>
          </div><!-- /.col-lg-4 -->
          <div class="col-lg-4">
            <img src="/images/create.jpg" class="bd-placeholder-img rounded-circle border" width="140" />
            <h2>Build Yours</h2>
            <p>Anyone can create a tour with Camino. Just log in and get started.</p>
            <p><a class="btn btn-outline-primary" href="/creator" role="button" data-cy="create-tour-link">Create a tour
                »</a></p>
          </div><!-- /.col-lg-4 -->
        </div>
      </div>
    </div>
  </div>
@endsection
