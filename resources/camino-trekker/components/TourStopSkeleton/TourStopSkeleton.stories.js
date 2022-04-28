import TourStopSkeleton from "./TourStopSkeleton.vue";
import mockTour from "../../common/__mocks__/mockTour.json";

export default {
  title: "Camino/TourStopSkeleton",
  component: TourStopSkeleton,
};

const Template = (args) => ({
  components: { TourStopSkeleton },
  setup() {
    return { args };
  },
  template: `
      <TourStopSkeleton v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  stopIndex: 1,
  locale: "en",
  tour: mockTour,
};
