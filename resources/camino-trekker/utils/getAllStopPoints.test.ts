import { expect, it, describe } from "@jest/globals";
import getAllStopPoints from "./getAllStopPoints";

const tour = {
  start_location: { lng: 1, lat: 2 },
  stops: [
    {
      stop_content: {
        stages: [
          {
            type: "navigation",
            targetPoint: { lng: 3, lat: 4 },
          },
        ],
      },
    },
    {
      stop_content: {
        stages: [
          {
            type: "navigation",
            targetPoint: { lng: 5, lat: 6 },
          },
        ],
      },
    },
  ],
};

describe("getAllStopPoints", () => {
  it("gets all stop points {lng, lat} from a tour including starting location", () => {
    expect(getAllStopPoints(tour)).toEqual([
      { lng: 1, lat: 2 }, // starting location and stop 0
      { lng: 3, lat: 4 }, // stop 1
      { lng: 5, lat: 6 }, // stop 2
    ]);
  });
});
