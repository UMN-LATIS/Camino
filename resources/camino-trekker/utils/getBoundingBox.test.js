import getBoundingBoxFromRoute from "./getBoundingBoxFromRoute.js";

describe("getBoundingBoxFromRoute", () => {
  it("creates a routes bounding box", () => {
    const route = [
      { lng: -1.1, lat: 5.0 },
      { lng: -4.0, lat: 4 },
      { lng: 23, lat: 0 },
      { lng: 7, lat: -3 },
    ];
    expect(getBoundingBoxFromRoute(route)).toEqual([
      [-4.0, -3],
      [23, 5.0],
    ]);
  });
});
