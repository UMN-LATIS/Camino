import MapPopup from "./MapPopup.vue";
import Map from "../Map/Map.vue";
import MapMarker from "../MapMarker/MapMarker.vue";
import { Default as MapStory } from "../Map/Map.stories.js";
import { Default as MapMarkerStory } from "../MapMarker/MapMarker.stories.js";

export default {
  title: "Camino/Map/MapPopup",
  component: MapPopup,
};

const Template = (args) => ({
  components: { Map, MapMarker, MapPopup },
  setup() {
    return { args, MapStory, MapMarkerStory };
  },
  template: `
    <Map v-bind="MapStory.args">
      <MapMarker v-bind="MapMarkerStory.args">
        <MapPopup v-bind="args">
          <h2>Starting Location</h2>
          <p>Let's go!!</p>
        </MapPopup>
      </MapMarker>
    </Map>
  `,
});

export const Default = Template.bind({});
Default.args = {};
