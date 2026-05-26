<?php

declare(strict_types=1);

use Geocoder\Laravel\Http\LaravelHttpClient;
use Geocoder\Laravel\ProviderAndDumperAggregator;
use Illuminate\Support\Facades\Http;
use Psr\Http\Client\ClientInterface;

// Regression coverage for the BindingResolutionException thrown when
// config/geocoder.php pinned the pre-13.x default HTTP adapter
// (Http\Client\Curl\Client) after that package was removed as a required
// dependency in toin0u/geocoder-laravel 13.x.

it('resolves the geocoder service from the container', function () {
    expect(app('geocoder'))->toBeInstanceOf(ProviderAndDumperAggregator::class);
});

it('configures a PSR-18 HTTP client as the geocoder adapter', function () {
    $adapterClass = config('geocoder.adapter');

    expect($adapterClass)->toBe(LaravelHttpClient::class);
    expect(app($adapterClass))->toBeInstanceOf(ClientInterface::class);
});

it('routes geocoder requests through the Laravel Http facade', function () {
    Http::fake([
        'api.mapbox.com/*' => Http::response([
            'type' => 'FeatureCollection',
            'features' => [],
        ]),
    ]);

    app('geocoder')->reverse(44.9778, -93.2650)->get();

    Http::assertSent(fn ($request) => str_contains($request->url(), 'api.mapbox.com'));
});
