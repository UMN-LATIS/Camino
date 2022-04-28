import { app } from "@storybook/vue3";
import { createStore } from "vuex";
import { getters } from "../../store/index.js";
import TourStop from "./TourStop.vue";
import mockTour from "../../common/__mocks__/mockTour.json";

const store = createStore({
  state: () => ({
    tour: mockTour,
    locale: "en",
    route: {
      params: {
        tourId: 6,
        stopIndex: 1,
      },
    },
  }),
  getters,
});

app.use(store);

export default {
  title: "Camino/TourStop",
  component: TourStop,
};

const Template = (args) => ({
  components: { TourStop },
  setup() {
    return { args };
  },
  template: `
      <TourStop />
  `,
});

export const Default = Template.bind({});
Default.args = {};
