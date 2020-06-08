<?php

namespace App\Policies;

use App\User;
use App\Tour;
use Illuminate\Auth\Access\HandlesAuthorization;

class TourPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function view(?User $user, Tour $tour)
    {
        if ($tour->active) {
            return true;
        }

        // visitors cannot view unpublished items
        if ($user === null) {
            return false;
        }

        // admin overrides published status
        if ($user->can('view unpublished tours')) {
            return true;
        }

        // authors can view their own unpublished posts
        return $tour->users->contains($user->id);
    }

    public function viewFeedback(?User $user, Tour $tour)
        {
        // visitors cannot view unpublished items
        if ($user === null) {
            return false;
        }

        // admin overrides published status
        if ($user->can('view all feedback')) {
            return true;
        }

        // authors can view their own unpublished posts
        return $tour->users->contains($user->id);
    }


    public function update(User $user, Tour $tour)
    {
        if ($user->can('edit own tours')) {
            return $tour->users->contains($user->id);
        }

        if ($user->can('edit all tours')) {
            return true;
        }
    }

    public function delete(User $user, Tour $tour)
    {
        if ($user->can('delete own tours')) {
            return $tour->users->contains($user->id);
        }

        if ($user->can('delete any tours')) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->can('create tours')) {
            return true;
        }
    }
}
