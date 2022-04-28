import getFullTourRoute from "./getFullTourRoute";

const tour = {
  start_location: { lng: 1, lat: 2 },
  stops: [
    {
      stop_content: {
        stages: [
          {
            type: "navigation",
            route: [
              { lng: 3, lat: 4 },
              { lng: 5, lat: 6 },
            ],
          },
        ],
      },
    },
    {
      stop_content: {
        stages: [
          {
            type: "navigation",
            route: [
              { lng: 7, lat: 8 },
              { lng: 9, lat: 10 },
            ],
          },
        ],
      },
    },
  ],
};

describe("getFullTourRoute", () => {
  it("gets all route lnglat points in a given tour", () => {
    expect(getFullTourRoute(tour)).toEqual([
      { lng: 1, lat: 2 },
      { lng: 3, lat: 4 },
      { lng: 5, lat: 6 },
      { lng: 7, lat: 8 },
      { lng: 9, lat: 10 },
    ]);
  });
});
