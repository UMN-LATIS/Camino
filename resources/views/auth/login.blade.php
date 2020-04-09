

{{-- @section('content') --}}
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Login</div>

                <div class="card-body">
                        <div class="form-group row">
                            <div class="col-md-6 offset-md-4">
                                <a href="{{ url('/socialite/github') }}" class="btn btn-github">GitHub Login</a>
                            </div>
                        </div>
                         <div class="form-group row">
                            <div class="col-md-6 offset-md-4">
                                <a href="{{ url('/shiblogin') }}" class="btn btn-mn">University of Minnesota</a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
{{-- @endsection --}}
