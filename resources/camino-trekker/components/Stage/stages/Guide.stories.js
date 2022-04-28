import Guide from "./Guide.vue";
import mockTour from "../../../common/__mocks__/mockTour.json";
import { getStagesFromTourWhere } from "../../../utils/index.js";

export default {
  title: "Camino/Stages/Guide",
  component: Guide,
};

const Template = (args) => ({
  components: { Guide },
  setup() {
    return { args };
  },
  template: `
    <Guide v-bind="args" />
  `,
});
const guideStages = getStagesFromTourWhere("type", "guide", mockTour);

export const Default = Template.bind({});
Default.args = {
  stage: guideStages[0],
};
