import { TOUR_STYLES } from "./constants.js";

export default () => ({
  public: false,
  active: false,
  title: "",
  start_location: {
    lng: 0,
    lat: 0,
  },
  walking: false,
  biking: false,
  driving: false,
  style: TOUR_STYLES.ENTIRE_TOUR,
  tour_content: {
    use_template: true,
    languages: ["English"],
    custom_base_map: {
      use_basemap: false,
      image: null,
      coords: {
        upperleft: {
          lat: null,
          lng: null,
        },
        lowerright: {
          lat: null,
          lng: null,
        },
      },
    },
  },
  stops: [],
  users: [],
});
