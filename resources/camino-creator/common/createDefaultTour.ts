import { Tour } from "@/types";
import { TourStyle, Locale } from "@/types";

export default (): Partial<Tour> => ({
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
  style: TourStyle.EntireTour,
  tour_content: {
    use_template: true,
    languages: [Locale.en],
    custom_base_map: {
      use_basemap: false,
      image: null,
      coords: {
        upperleft: null,
        lowerright: null,
      },
    },
  },
  stops: [],
  users: [],
});
