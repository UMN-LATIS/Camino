<?php

declare(strict_types=1);

/**
 * Unit-tests the pure JSON transform exposed by the
 * 2026_05_20_105430_rename_navigation_stage_route_to_waypoints migration.
 *
 * The transform is decoupled from the DB so we can exercise it without
 * RefreshDatabase, which doesn't work under this project's sqlite test driver
 * (a legacy migration uses dropForeign, unsupported by sqlite).
 */

function loadRenameMigration(): object
{
    $path = dirname(__DIR__, 3)
        . '/database/migrations/2026_05_20_105430_rename_navigation_stage_route_to_waypoints.php';

    return require $path;
}

it('renames `route` to `waypoints` on a navigation stage', function () {
    $migration = loadRenameMigration();
    $input = [
        'id' => 'nav-1',
        'type' => 'navigation',
        'text' => ['English' => 'Head north.'],
        'route' => [['lat' => 1, 'lng' => 2]],
        'targetPoint' => ['lat' => 3, 'lng' => 4],
    ];

    $result = $migration->renameRouteToWaypoints($input);

    expect($result)->toHaveKey('waypoints', [['lat' => 1, 'lng' => 2]]);
    expect($result)->not->toHaveKey('route');
    expect($result['targetPoint'])->toEqual(['lat' => 3, 'lng' => 4]);
    expect($result['id'])->toBe('nav-1');
});

it('leaves non-navigation stages untouched', function () {
    $migration = loadRenameMigration();

    expect($migration->renameRouteToWaypoints(['id' => 'sep-1', 'type' => 'separator']))
        ->toEqual(['id' => 'sep-1', 'type' => 'separator']);

    expect(
        $migration->renameRouteToWaypoints([
            'id' => 'guide-1',
            'type' => 'guide',
            'text' => ['English' => 'About.'],
        ])
    )->toEqual([
        'id' => 'guide-1',
        'type' => 'guide',
        'text' => ['English' => 'About.'],
    ]);
});

it('is a no-op on a navigation stage that already uses `waypoints`', function () {
    $migration = loadRenameMigration();
    $already = [
        'id' => 'nav-1',
        'type' => 'navigation',
        'waypoints' => [['lat' => 1, 'lng' => 2]],
        'targetPoint' => null,
    ];

    expect($migration->renameRouteToWaypoints($already))->toEqual($already);
});

it('is idempotent across repeated application', function () {
    $migration = loadRenameMigration();
    $input = [
        'id' => 'nav-1',
        'type' => 'navigation',
        'route' => [['lat' => 1, 'lng' => 2]],
        'targetPoint' => null,
    ];

    $once = $migration->renameRouteToWaypoints($input);
    $twice = $migration->renameRouteToWaypoints($once);

    expect($twice)->toEqual($once);
});

it('down() reverses the rename', function () {
    $migration = loadRenameMigration();
    $migrated = [
        'id' => 'nav-1',
        'type' => 'navigation',
        'waypoints' => [['lat' => 1, 'lng' => 2]],
        'targetPoint' => ['lat' => 3, 'lng' => 4],
    ];

    $reverted = $migration->renameWaypointsToRoute($migrated);

    expect($reverted)->toHaveKey('route', [['lat' => 1, 'lng' => 2]]);
    expect($reverted)->not->toHaveKey('waypoints');
    expect($reverted['targetPoint'])->toEqual(['lat' => 3, 'lng' => 4]);
});
