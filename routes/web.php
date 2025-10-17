<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\CaminoTrekkerController;
use App\Http\Controllers\TourDeepDivesEmailController;

Route::impersonate();


// Main App (Homepage)
Route::get('/', "HomeController@index");
Route::get('/about', "HomeController@about");
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/findTours', 'HomeController@findTours');

// Admin
Route::group(['prefix' => 'admin', 'middleware' => ['auth', 'permission:administer site']], function () {
  Route::resource('users', 'Admin\\UsersController');
});

// API
Route::get('/api/tour/{tour}', "HomeController@loadTour");
Route::get('/api/tours/', "HomeController@loadTours");
Route::post('/api/tour/{tour}/deepdivesEmail', TourDeepDivesEmailController::class);
Route::post('/feedback/{tour}', 'HomeController@storeFeedback');

// Camino Trekker App
Route::get('/trekker/{all?}', [CaminoTrekkerController::class, 'index'])->where(['all' => '.*']);
Route::get('/ar/{tour}/{stopIndex}/{locale}/{simulateLocation?}', "HomeController@ar")->where([ 'stopIndex' => '[0-9]+']);

// Camino Creator App
Route::group(['prefix' => 'creator', 'middleware' => ['auth']], function () {
  Route::get('/', "TourEditController@index");
  Route::resource("edit", "TourEditController")->parameters([
    'edit' => 'tour'
  ]);

  Route::post('/image/store', 'ImageController@store');
  Route::delete('/image/{filename}', 'ImageController@delete');
  Route::post("/edit/{tour}/stop", "TourEditController@createStop");
  Route::put("/edit/{tour}/stop/{stop}", "TourEditController@updateStop");
  Route::delete("/edit/{tour}/stop/{stop}", "TourEditController@deleteStop");
  Route::get('/{tour}/feedback/', "TourEditController@getFeedback");
  Route::post("/{tour}/share/", "TourEditController@shareTour");
  Route::get("/{tour}/join/{tourHash}", "TourEditController@joinTour");
  Route::any('{all}', 'TourEditController@index')->where(['all' => '.*']);
});


// Auth stuff
Route::get("/login", "HomeController@login")->name("login");
Route::get("/logout", "HomeController@logout")->name("logout");
Route::get('socialite/{provider}', 'Auth\SocialiteController@redirectToProvider');
Route::get('socialite/{provider}/callback', 'Auth\SocialiteController@handleProviderCallback');

if (config('shibboleth.emulate_idp')) {
  Route::name('shiblogin')->get("shiblogin", '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@emulateLogin');
  Route::group(['middleware' => 'web'], function () {
    Route::get('emulated/idp', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@emulateIdp');
    Route::post('emulated/idp', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@emulateIdp');
    Route::get('emulated/login', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@emulateLogin');
    Route::get('emulated/logout', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@emulateLogout');
  });
} else {
  Route::name('shiblogin')->get("shiblogin", '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@login');
  Route::group(['middleware' => 'web'], function () {
    Route::name('shibboleth-login')->get('/shibboleth-login', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@login');
    Route::name('shibboleth-authenticate')->get('/shibboleth-authenticate', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@idpAuthenticate');
    Route::name('shibboleth-logout')->get('/shibboleth-logout', '\StudentAffairsUwm\Shibboleth\Controllers\ShibbolethController@destroy');
  });
}
