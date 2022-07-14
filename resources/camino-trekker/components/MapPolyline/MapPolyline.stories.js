import MapPolyline from "./MapPolyline.vue";
import Map from "../Map/Map.vue";
import { FitBounds as MapStory } from "../Map/Map.stories.js";
import mockTour from "../../common/__mocks__/mockTour.json";
import getFullTourRoute from "../../utils/getFullTourRoute.js";

export default {
  title: "Camino/Map/MapPolyline",
  component: MapPolyline,
};

const Template = (args) => ({
  components: { Map, MapPolyline },
  setup() {
    return { args, MapStory };
  },
  template: `
    <Map v-bind="MapStory.args">
      <MapPolyline v-bind="args" />
    </Map>
  `,
});

export const Default = Template.bind({});
Default.args = {
  positions: getFullTourRoute(mockTour),
  id: "fullTourRoute",
};

export const Colored = Template.bind({});
Colored.args = {
  ...Default.args,
  color: "#ff453a",
};
