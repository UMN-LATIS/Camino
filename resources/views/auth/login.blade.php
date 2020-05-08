@extends("base")

@section("content")

{{-- @section('content') --}}
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Log In to Camino</div>

                <div class="card-body">
                      <div class="form-group row">
                            <div class="col-md-6 offset-md-3">
                                <a href="{{ url('/shiblogin') }}" class="btn university btn-lg d-flex align-items-center justify-content-center text-light"><i class="fa fa-university fa-2x fa-inverse  mr-2"></i> University of Minnesota</a>
                            </div>
                        </div>
                         {{-- <div class="form-group row">
                            <div class="col-md-6 offset-md-3 text-center">
                                <p class="display-4">or</p>
                            </div>
                        </div> --}}
                        <div class="form-group row">
                            <div class="col-md-4">
                                <a href="{{ url('/socialite/github') }}" class="btn github btn-lg d-flex align-items-center justify-content-center text-light"><i class="fab fa-github fa-2x fa-inverse  mr-2"></i> GitHub Login</a>
                                <span class="hidden-xs"></span>
                            </div>
                             <div class="col-md-4">
                                <a href="{{ url('/socialite/facebook') }}" class="btn facebook btn-lg d-flex align-items-center justify-content-center text-light"><i class="fab fa-facebook fa-2x fa-inverse mr-2"></i> Facebook Login</a>
                                <span class="hidden-xs"></span>
                            </div>
                             <div class="col-md-4">
                                <a href="{{ url('/socialite/google') }}" class="btn google btn-lg d-flex align-items-center justify-content-center text-light"><i class="fab fa-google fa-2x fa-inverse  mr-2"></i> Google Login</a>
                                <span class="hidden-xs"></span>
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
