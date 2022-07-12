@php var_dump($deepdives) @endphp

@foreach ($deepdives as $deepdive)
  <h1>Tour DeepDives</h1>

  <h2>{{ $deepdive->title }}</h2>
  <div>
    {{ $deepdive->text }}
  </div>
@endforeach
