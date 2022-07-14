import { Tour, TourStyle, Locale } from "@/types";
import { UMN_LNGLAT } from "@/shared/constants";

export default (): Partial<Tour> => ({
  public: false,
  active: false,
  title: "",
  start_location: UMN_LNGLAT,
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
