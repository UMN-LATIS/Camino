@component('mail::message')
# [{{ $tour->title }} Deep Dives]({{ $tour_url }})

You're receiving this email because someone (probably you) asked to share more information about this tour.

---

@foreach ($localizedDeepDives as $deepdive)

## {{ $deepdive['title'] }}

{!! $deepdive['text'] !!}

@endforeach

Thanks,<br>
{{ config('app.name') }}
@endcomponent
