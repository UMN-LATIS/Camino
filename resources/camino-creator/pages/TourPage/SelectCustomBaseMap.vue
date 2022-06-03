<template>
  <div>
    <CheckboxInput
      label="Custom Base Map"
      :modelValue="useBaseMap"
      @update:modelValue="(payload: boolean) => $emit('update:useBaseMap', payload)"
    />

    <div v-if="useBaseMap">
      <ImageUpload
        v-if="!imageSrc"
        :imageSrc="imageSrc"
        @imageuploaded="
          (maybeImg) => $emit('update:imageSrc', maybeImg?.src ?? null)
        "
      />
      <div class="row">
        <div class="form-group col-sm-2">
          <label for="upper-left-latitude">Upper Left Latitude</label>
          <input
            type="text"
            class="form-control"
            :value="upperLeftCoord?.lat || 0"
            @input="updateUpperLeftLat"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="upper-left-longitude">Upper Left Longitude</label>
          <input
            type="text"
            class="form-control"
            :value="upperLeftCoord?.lng || 0"
            @input="updateUpperLeftLng"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="lower-right-latitude">Lower Right Latitude</label>
          <input
            type="text"
            class="form-control"
            :value="lowerRightCoord?.lat || 0"
            @input="updateLowerRightLat"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="lower-right-latitude">Lower Right Longitude</label>
          <input
            type="text"
            class="form-control"
            :value="lowerRightCoord?.lng || 0"
            @input="updateLowerRightLng"
          />
        </div>
        <div class="col-sm-2">
          <img
            v-if="imageSrc"
            :src="'/storage/' + imageSrc"
            class="img-thumbnail rounded"
          />
          <button
            v-if="imageSrc"
            class="btn btn-outline-danger float-right"
            @click="$emit('update:imageSrc', null)"
          >
            <i class="fas fa-trash"></i> Remove basemap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LngLat, Maybe } from "@/types";
import CheckboxInput from "../../components/CheckboxInput.vue";
import ImageUpload from "../../components/ImageUpload.vue";

interface Props {
  useBaseMap: boolean;
  imageSrc: Maybe<string>;
  upperLeftCoord: Maybe<LngLat>;
  lowerRightCoord: Maybe<LngLat>;
}
const props = defineProps<Props>();

interface Emits {
  (eventName: "update:useBaseMap", newVal: boolean): void;
  (eventName: "update:imageSrc", newImage: Maybe<string>): void;
  (eventName: "update:upperLeftCoord", coord: LngLat): void;
  (eventName: "update:lowerRightCoord", coord: LngLat): void;
}

const emit = defineEmits<Emits>();

const updateUpperLeftLng = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  const lng = Number.parseInt(val);
  const lat = props.upperLeftCoord?.lat ?? 0;

  emit("update:upperLeftCoord", { lng, lat });
};

const updateUpperLeftLat = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  const lng = props.upperLeftCoord?.lng ?? 0;
  const lat = Number.parseInt(val);

  emit("update:upperLeftCoord", { lng, lat });
};

const updateLowerRightLng = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  const lng = Number.parseInt(val);
  const lat = props.upperLeftCoord?.lat ?? 0;

  emit("update:lowerRightCoord", { lng, lat });
};

const updateLowerRightLat = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  const lng = props.upperLeftCoord?.lng ?? 0;
  const lat = Number.parseInt(val);

  emit("update:lowerRightCoord", { lng, lat });
};
</script>
