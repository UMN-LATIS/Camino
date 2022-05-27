import { app } from "@storybook/vue3";
import { createStore } from "vuex";
import TourMap from "./TourMap.vue";
import mockTour from "../../common/__mocks__/mockTour.json";
import { getters } from "../../useTrekkerStore";

const store = createStore({
  state: () => ({
    tour: mockTour,
    locale: "en",
    route: {
      params: {
        tourId: 6,
        stopIndex: 3,
      },
    },
  }),
  getters,
});

app.use(store);

export default {
  title: "Camino/TourMap",
  component: TourMap,
};

const Template = (args) => ({
  components: { TourMap },
  setup() {
    return {
      args,
      mockTour,
    };
  },
  template: `
    <TourMap v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  initialMapStyle: "light",
  type: "tour",
  stopIndex: 6,
};

export const StopMap = Template.bind({});
StopMap.args = {
  initialMapStyle: "satellite",
  type: "stop",
  stopIndex: 4,
};
