<?php

use App\Stop;
use Illuminate\Database\Migrations\Migration;

/**
 * Renames `route` → `waypoints` on navigation stages inside `tour_stops.stop_content`.
 *
 * Background: `route` historically named the interior waypoint list on a
 * navigation stage, but elsewhere in the codebase `route` means "the full
 * polyline" (`[start, ...interior, end]`). This migration aligns the stored
 * field with the in-memory name so there's a single source of truth and no
 * translation layer at the API boundary.
 *
 * Idempotent: rows already on `waypoints` are left alone.
 */
return new class extends Migration
{
    public function up(): void
    {
        Stop::all()->each(function ($stop) {
            $stages = collect($stop->stop_content['stages'] ?? [])
                ->map(fn ($stage) => $this->renameRouteToWaypoints($stage))
                ->toArray();

            $stop->stop_content = [
                ...$stop->stop_content,
                'stages' => $stages,
            ];
            $stop->save();
        });
    }

    public function down(): void
    {
        Stop::all()->each(function ($stop) {
            $stages = collect($stop->stop_content['stages'] ?? [])
                ->map(fn ($stage) => $this->renameWaypointsToRoute($stage))
                ->toArray();

            $stop->stop_content = [
                ...$stop->stop_content,
                'stages' => $stages,
            ];
            $stop->save();
        });
    }

    /** Public for testability; this is a pure JSON transform with no DB coupling. */
    public function renameRouteToWaypoints(array $stage): array
    {
        if (($stage['type'] ?? null) !== 'navigation') {
            return $stage;
        }
        if (!array_key_exists('route', $stage)) {
            return $stage;
        }
        $stage['waypoints'] = $stage['route'];
        unset($stage['route']);

        return $stage;
    }

    /** Public for testability; this is a pure JSON transform with no DB coupling. */
    public function renameWaypointsToRoute(array $stage): array
    {
        if (($stage['type'] ?? null) !== 'navigation') {
            return $stage;
        }
        if (!array_key_exists('waypoints', $stage)) {
            return $stage;
        }
        $stage['route'] = $stage['waypoints'];
        unset($stage['waypoints']);

        return $stage;
    }
};
