@extends('base')

@section('content')
<div id="app" >
        <site-nav current-route={{ Route::current()->uri() }}></site-nav>
</div>
<div class="container">
<div class="row">

      <div class="col-lg-8">

        <h1 class="mt-4">About Camino</h1>
{{-- 
        <!-- Author -->
        <p class="lead">
          by
          <a href="#">Start Bootstrap</a>
        </p> --}}

        <hr>

        <!-- Date/Time -->
        {{-- <p>Posted on January 1, 2019 at 12:00 PM</p> --}}

        {{-- <hr> --}}

        <!-- Preview Image -->
        {{-- <im/g class="img-fluid rounded" src="http://placehold.it/900x300" alt=""> --}}

        {{-- </hr> --}}

        <!-- Post Content -->
        <p class="lead">Camino is a platform for building academically-rich, augmented reality-enhanced guided tours.</p>

        <p>We built Camino to allow experts to share their passions, by creating easy to use and rich walking, biking, and driving tours. These tours allow you to go beyond the "tourist" level, and dive deep on subjects that interest you. Anyone can build tours with Camino, using nothing more than a web browser. And anyone can take a Camino tour, using nothing more than their smartphone or tablet - no software to install, nothing to buy, and no sketchy advertising companies tracking your location.</p>

        <p>Whether you're passionate about history, geography, art, food or nature, consider how you can share your expertise with those in your community. We're still in the early stages of building Camino, but we plan to offer guides and webinars to help support and inspire you. For now, play around, and let us know what you think.</p>

        {{-- <blockquote class="blockquote">
          <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
          <footer class="blockquote-footer">Someone famous in
            <cite title="Source Title">Source Title</cite>
          </footer>
        </blockquote>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, nostrum, aliquid, animi, ut quas placeat totam sunt tempora commodi nihil ullam alias modi dicta saepe minima ab quo voluptatem obcaecati?</p>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis. Sunt, ut, explicabo, aliquam tenetur ratione tempore quidem voluptates cupiditate voluptas illo saepe quaerat numquam recusandae? Qui, necessitatibus, est!</p>

        <hr> --}}

   
    </div>

</div>
@endsection
