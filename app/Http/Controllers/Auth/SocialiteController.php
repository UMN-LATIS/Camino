<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Socialite;
use Auth;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback($provider)
    {
        $userSocial = Socialite::driver($provider)->user();
        // $userSocial =   Socialite::driver($provider)->stateless()->user();
        $users       =   \App\User::where(['email' => $userSocial->getEmail()])->first();
        if($users){
            Auth::login($users);
            return redirect('/');
        }else{
            $user = \App\User::create([
                'name'          => $userSocial->getName(),
                'email'         => $userSocial->getEmail(),
                'unique_id'         => $userSocial->getEmail(),
                'provider'      => $provider,
            ]);
            Auth::login($user);
            return redirect("/creator");
        }
    }
}