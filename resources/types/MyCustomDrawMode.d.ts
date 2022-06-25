/**
 * A version of DrawCustomMode that fixes some inaccurate typings
 * like required functions and MosueEvent vs MapMouseEvent
 * @see: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mapbox__mapbox-gl-draw
 */

import { GeoJSON } from "geojson";
import { MapMouseEvent } from "mapbox-gl";
import type { DrawCustomModeThis } from "@mapbox/mapbox-gl-draw";

export interface MyCustomDrawMode<
  CustomModeState = any,
  CustomModeOptions = any
> {
  onSetup(
    this: DrawCustomModeThis,
    options: CustomModeOptions
  ): CustomModeState;

  onDrag?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onClick?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onMouseMove?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onMouseDown?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onMouseUp?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onMouseOut?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: MapMouseEvent
  ): void;

  onKeyUp?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: KeyboardEvent
  ): void;

  onKeyDown?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: KeyboardEvent
  ): void;

  onTouchStart?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: TouchEvent
  ): void;

  onTouchMove?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: TouchEvent
  ): void;

  onTouchEnd?(
    this: DrawCustomModeThis,
    state: CustomModeState,
    e: TouchEvent
  ): void;

  onTap?(this: DrawCustomModeThis, state: CustomModeState, e: TouchEvent): void;

  onStop?(this: DrawCustomModeThis, state: CustomModeState): void;

  onTrash?(this: DrawCustomModeThis, state: CustomModeState): void;

  onCombineFeature?(this: DrawCustomModeThis, state: CustomModeState): void;

  onUncombineFeature?(this: DrawCustomModeThis, state: CustomModeState): void;

  toDisplayFeatures(
    this: DrawCustomModeThis,
    state: CustomModeState,
    geojson: GeoJSON,
    display: (geojson: GeoJSON) => void
  ): void;
}
