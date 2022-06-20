import { InjectionKey, type Ref } from "vue";
import { LngLat } from "@/types";
import { Map, Marker } from "mapbox-gl";

export const UMN_LNGLAT: LngLat = {
  lat: 44.972109,
  lng: -93.24287,
};

export const MapInjectionKey: InjectionKey<Ref<Map>> = Symbol("MapboxGLMap");

export const MarkerInjectionKey: InjectionKey<Ref<Marker>> =
  Symbol("MapboxGLMarker");
