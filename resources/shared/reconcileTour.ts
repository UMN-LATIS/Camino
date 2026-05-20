import {
  StageType,
  type Tour,
  type Stage,
  type NavigationStage,
  type LngLat,
} from "@/types";
import getOffsetPointFrom from "@/shared/getOffsetPointFrom";
import lngLatEquals from "./lngLatEquals";
import { UMN_LNGLAT } from "./constants";

/**
 * Map every stage in a tour, threading a `carry` value through each step
 * so that we can pass info to the next step. (like mapAccum)
 */
function mapOverStages<TCarry>(
  tour: Tour,
  step: (stage: Stage, carry: TCarry) => [Stage, TCarry],
  initialCarry: TCarry,
): Tour {
  let carry = initialCarry;
  return {
    ...tour,
    stops: tour.stops.map((stop) => ({
      ...stop,
      stop_content: {
        ...stop.stop_content,
        stages: stop.stop_content.stages.map((stage) => {
          const [newStage, newCarry] = step(stage, carry);
          carry = newCarry;
          return newStage;
        }),
      },
    })),
  };
}

function dedupeConsecutive(points: LngLat[]): LngLat[] {
  return points.filter(
    (point, i) => i === 0 || !lngLatEquals(point, points[i - 1]),
  );
}

function isNavigationStage(stage: Stage): stage is NavigationStage {
  return stage.type === StageType.Navigation;
}

type ReconcileStageCarry = { derivedStartPoint: LngLat };

function reconcileStage(
  stage: Stage,
  { derivedStartPoint }: ReconcileStageCarry,
): [Stage, ReconcileStageCarry] {
  if (!isNavigationStage(stage)) {
    const carry = { derivedStartPoint };
    return [stage, carry];
  }

  const targetPoint =
    stage.targetPoint ?? getOffsetPointFrom(derivedStartPoint);
  const waypoints = dedupeConsecutive([
    derivedStartPoint,
    ...(stage.waypoints ?? []),
    targetPoint,
  ]).slice(1, -1);

  const reconciledStage = { ...stage, targetPoint, waypoints };
  const carry = { derivedStartPoint: targetPoint };

  return [reconciledStage, carry];
}

/** Re-derives stop start points, fills missing target points, and cleans waypoints. Pure transform and idempotent. */
export default function reconcileTour(tour: Tour): Tour {
  return mapOverStages(tour, reconcileStage, {
    derivedStartPoint: tour.start_location ?? UMN_LNGLAT,
  });
}
