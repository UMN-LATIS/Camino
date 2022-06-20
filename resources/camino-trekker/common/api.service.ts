import axios from "axios";
import config from "../config";

export const toursService = {
  get(tourId) {
    return axios(`${config.appUrl}/api/tour/${tourId}`)
      .then((response) => response.data)
      .catch(console.error);
  },
  list() {
    return axios(`${config.appUrl}/api/tours`)
      .then((res) => res.data)
      .catch(console.error);
  },
};
