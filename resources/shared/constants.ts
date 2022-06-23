import { InjectionKey, type Ref } from "vue";
import { LngLat } from "@/types";
import { Map, Marker } from "mapbox-gl";
import { Map as LeafletMap } from "leaflet";
import { Marker as LeafletMarker } from "leaflet";

export const UMN_LNGLAT: LngLat = {
  lat: 44.972109,
  lng: -93.24287,
};

export const MapInjectionKey: InjectionKey<Ref<Map>> = Symbol("MapboxGLMap");

export const MarkerInjectionKey: InjectionKey<Ref<Marker>> =
  Symbol("MapboxGLMarker");

export const LeafletMapInjectionKey: InjectionKey<Ref<LeafletMap>> =
  Symbol("LeafletMap");

export const LeafletMarkerInjectionKey: InjectionKey<Ref<LeafletMarker>> =
  Symbol("LeafletMarker");
