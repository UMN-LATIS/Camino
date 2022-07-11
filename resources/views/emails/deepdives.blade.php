@foreach ($hotwords as $word => $content)

<h1>{{ $word }}</h2>
<p>{!! $content !!}</p>

@endforeach