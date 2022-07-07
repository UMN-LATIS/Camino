import Navigation from "./Navigation.vue";
import mockTour from "../../../common/__mocks__/mockTour.json";
import { getStagesFromTourWhere } from "../../../utils/index.js";

export default {
  title: "Camino/Stages/Navigation",
  component: Navigation,
};

const Template = (args) => ({
  components: { Navigation },
  setup() {
    return { args, mockTour };
  },
  template: `
      <Navigation v-bind="args" />
  `,
});

const navStages = getStagesFromTourWhere("type", "navigation", mockTour);

export const Default = Template.bind({});
Default.args = {
  stopIndex: 3,
  stage: navStages[3],
  locale: "en",
};
