import { LngLat } from "@/types";

export default function getOffsetPointFrom(
  pt: LngLat,
  offset = 0.0005
): LngLat {
  return {
    lng: pt.lng + offset,
    lat: pt.lat + offset,
  };
}
