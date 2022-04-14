<template>
  <div>
    <CheckboxInput
      label="Custom Base Map"
      :modelValue="useBaseMap"
      @update:modelValue="(payload) => $emit('update:useBaseMap', payload)"
    />

    <div v-if="useBaseMap">
      <ImageUpload
        v-if="!image"
        :imageSrc="image"
        @imageuploaded="(payload) => $emit('update:image', payload)"
      />
      <div class="row">
        <div class="form-group col-sm-2">
          <label for="upper-left-latitude">Upper Left Latitude</label>
          <input
            type="text"
            class="form-control"
            :value="upperLeftCoord.lat"
            @input="updateUpperLeftLat"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="upper-left-longitude">Upper Left Longitude</label>
          <input
            type="text"
            class="form-control"
            :value="upperLeftCoord.lng"
            @input="updateUpperLeftLng"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="lower-right-latitude">Lower Right Latitude</label>
          <input
            type="text"
            class="form-control"
            :value="lowerRightCoord.lat"
            @input="updateLowerRightLat"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="lower-right-latitude">Lower Right Longitude</label>
          <input
            type="text"
            class="form-control"
            :value="lowerRightCoord.lng"
            @input="updateLowerRightLng"
          />
        </div>
        <div class="col-sm-2">
          <img
            v-if="image"
            :src="'/storage/' + image"
            class="img-thumbnail rounded"
          />
          <button
            v-if="image"
            class="btn btn-outline-danger float-right"
            @click="$emit('update:image', '')"
          >
            <i class="fas fa-trash"></i> Remove basemap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import CheckboxInput from "../../components/CheckboxInput.vue";
import ImageUpload from "../../components/ImageUpload.vue";

const props = defineProps({
  useBaseMap: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  upperLeftCoord: {
    type: Object,
    required: true,
  },
  lowerRightCoord: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:useBaseMap",
  "update:image",
  "update:upperLeftCoord",
  "update:lowerRightCoord",
]);

const createCoordUpdater = (coordName, lngOrLat) => (event) =>
  emit(`update:${coordName}`, {
    ...props[coordName],
    [lngOrLat]: event.target.value,
  });

const updateUpperLeftLat = createCoordUpdater("upperLeftCoord", "lat");

const updateUpperLeftLng = createCoordUpdater("upperLeftCoord", "lng");

const updateLowerRightLat = createCoordUpdater("lowerRightCoord", "lat");
const updateLowerRightLng = createCoordUpdater("lowerRightCoord", "lng");
</script>
