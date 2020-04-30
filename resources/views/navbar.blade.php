<nav class="navbar navbar-expand-sm navbar-light bg-light">
     <a class="navbar-brand" href="/">Camino</a>
     <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
         aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
     </button>
     <div class="collapse navbar-collapse" id="collapsibleNavId">
         <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
             <li class="nav-item {{ Request::is('about') ? 'active' : '' }}">
                 <a class="nav-link" href="{{ url('/about') }}">About</a>
             </li>
             <li class="nav-item {{ Request::is('findTours') ? 'active' : '' }}">
                 <a class="nav-link" href="{{ url('/findTours') }}">Find Tours</a>
             </li>
             <li class="nav-item">
                 <a class="nav-link" href="/creator">Create</a>
             </li>
         </ul>
     </div>
 </nav>