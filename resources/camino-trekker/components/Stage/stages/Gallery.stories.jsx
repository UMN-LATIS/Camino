import Gallery from "./Gallery.vue";
import mockTour from "../../../common/__mocks__/mockTour.json";
import { getStagesFromTourWhere } from "../../../utils/index.js";

export default {
  title: "Camino/Stages/Gallery",
  component: Gallery,
};

const Template = (args) => ({
  components: { Gallery },
  setup() {
    return { args };
  },
  template: `
    <Gallery v-bind="args" />
  `,
});
const stages = getStagesFromTourWhere("type", "gallery", mockTour);

export const Default = Template.bind({});
Default.args = {
  stage: stages[0],
};
