import MapMarker from "./MapMarker.vue";
import Map from "../Map/Map.vue";
import { Default as MapStory } from "../Map/Map.stories.js";
import mockTour from "../../common/__mocks__/mockTour.json";
import { getStagesFromTourWhere } from "../../utils/index.js";

export default {
  title: "Camino/Map/MapMarker",
  component: MapMarker,
};

const Template = (args) => ({
  components: { Map, MapMarker },
  setup() {
    return { args, MapStory };
  },
  template: `
    <Map v-bind="MapStory.args">
      <MapMarker v-bind="args" />
    </Map>
  `,
});

const navStages = getStagesFromTourWhere("type", "navigation", mockTour);
const navStagesWithRoutes = navStages.filter((stage) => stage?.route.length);
const stage1 = navStagesWithRoutes[1];

export const Default = Template.bind({});
Default.args = {
  lng: mockTour.start_location.lng,
  lat: mockTour.start_location.lat,
};

export const ColoredMarker = Template.bind({});
ColoredMarker.args = {
  lng: stage1.targetPoint.lng,
  lat: stage1.targetPoint.lat,
  color: "red",
};
