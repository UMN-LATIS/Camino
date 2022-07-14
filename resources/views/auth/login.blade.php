@extends('base')

@section('content')
  {{-- @section('content') --}}
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Log In to Camino</div>

          <div class="card-body" data-cy="login-options">
            <div class="form-group row d-flex justify-content-center mb-4">
              <div class="col-12 col-md-12 col-lg-6">
                <a href="{{ url('/shiblogin') }}"
                  class="btn university btn-lg d-flex align-items-center justify-content-center text-light"><i
                    class="fa fa-university fa-2x fa-inverse me-2"></i> University of Minnesota</a>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-12  col-md-12 col-lg-4 ">
                <a href="{{ url('/socialite/google') }}"
                  class="m-1 m-lg-0 btn google btn-lg d-flex align-items-center justify-content-center text-light"><i
                    class="fab fa-google fa-2x fa-inverse me-2"></i> Google Login</a>
              </div>
              <div class="col-12  col-md-12 col-lg-4 ">
                <a href="{{ url('/socialite/live') }}"
                  class="m-1 m-lg-0 btn github btn-lg d-flex align-items-center justify-content-center text-light"><i
                    class="fab fa-microsoft fa-2x fa-inverse me-2"></i> Microsoft Login</a>
              </div>
              <div class="col-12  col-md-12 col-lg-4 ">
                <a href="{{ url('/socialite/facebook') }}"
                  class="m-1 m-lg-0 btn facebook btn-lg d-flex align-items-center justify-content-center text-light"><i
                    class="fab fa-facebook fa-2x fa-inverse me-2"></i> Facebook Login</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <style>
    .github {
      background: #666666;
    }

    .google {
      background: #c32f10
    }

    .facebook {
      background: #3b5998;
    }

    .university {
      background: #7a0019;
    }
  </style>
@endsection
