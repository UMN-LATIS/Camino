import { LngLat } from "@/types";

export default (lnglat1: LngLat, lnglat2: LngLat): boolean =>
  lnglat1.lat === lnglat2.lat && lnglat1.lng === lnglat2.lng;
