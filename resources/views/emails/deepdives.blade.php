<h1>Tour DeepDives</h1>

@php echo $localizedDeepDives @endphp

@foreach ($localizedDeepDives as $deepdive)
  <h2>{{ $deepdive['title'] }}</h2>
  <div>
    {!! $deepdive['text'] !!}
  </div>
@endforeach
