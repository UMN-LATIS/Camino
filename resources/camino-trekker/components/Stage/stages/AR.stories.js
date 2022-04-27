import AR from "./AR.vue";
import mockTour from "../../../common/__mocks__/mockTour.json";
import { getStagesFromStopWhere } from "../../../utils/index.js";

export default {
  title: "Camino/Stages/AR",
  component: AR,
};

const Template = (args) => ({
  components: { AR },
  setup() {
    return { args };
  },
  template: `
    <AR v-bind="args" />
  `,
});

const arStop = mockTour.stops.find((stop) => {
  return getStagesFromStopWhere("type", "ar", stop).length > 0;
});
const arStopTargetPoint =
  getStagesFromStopWhere("type", "navigation", arStop)?.targetPoint ||
  mockTour.start_location;

export const Default = Template.bind({});
Default.args = {
  stage: getStagesFromStopWhere("type", "ar", arStop)[0],
  locale: "en",
  simulateLocation: mockTour.start_location,
  currentStopTargetPoint: arStopTargetPoint,
  debugMode: true,
};
