import pipe from "../utils/pipe";
import axios from "axios";
import config from "../config";

const middlewares = [];
export const toursService = {
  get(tourId) {
    return axios(`${config.appUrl}/api/tour/${tourId}`)
      .then(pipe(...middlewares))
      .then((response) => response.data)
      .catch(console.error);
  },
  applyMiddlewares(response) {
    return pipe(...middlewares)(response);
  },
  list() {
    return axios(`${config.appUrl}/api/tours`)
      .then(pipe(...middlewares))
      .then((res) => res.data)
      .catch(console.error);
  },
  use(middleware) {
    middlewares.push(middleware);
  },
};

// function replaceObjectKeys([oldKeyName, newKeyName], obj) {
//   const ObjAsString = JSON.stringify(obj);
//   const newObjAsString = ObjAsString.replace(
//     new RegExp(`"${oldKeyName}":`, "g"),
//     `"${newKeyName}":`
//   );
//   return JSON.parse(newObjAsString);
// }

// function convertEnglishToEn(response) {
//   const newData = replaceObjectKeys(["English", "en"], response.data);
//   return { ...response, data: newData };
// }

// toursService.use(convertEnglishToEn);
