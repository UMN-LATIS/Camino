import { ref, type Ref, type ComputedRef, computed } from "vue";
import { mergeDeepRight, insert, move } from "ramda";
import { defineStore, acceptHMRUpdate } from "pinia";
import createDefaultStop from "../common/createDefaultStop";
import createDefaultTour from "../common/createDefaultTour";
import { axiosClient as axios } from "@/shared/axios";
import type {
  Tour,
  TourStop,
  CoreStage,
  Image,
  RecursivePartial,
} from "@/types";
import * as selectors from "./creatorStoreSelectors";
import normalizeTour from "@/shared/normalizeTour";

export interface CreatorStoreState {
  tours: Ref<Tour[]>;
  error: Ref<string | null>;
  isReady: Ref<boolean>;
}

export const useCreatorStore = defineStore("creator", () => {
  const state: CreatorStoreState = {
    tours: ref([]),
    error: ref(null),
    isReady: ref(false),
  };

  // computed version of the selectors
  const getters = {
    getState: () => state,

    getTour: (tourId: number) =>
      computed(() => selectors.selectTour(state, tourId)),

    getTourStop: (tourId: number, stopId: number) =>
      computed(() => selectors.selectTourStop(state, tourId, stopId)),

    getTourIndex: (tourId: number) =>
      computed(() => selectors.selectTourIndex(state, tourId)),

    getTourAndStopIndex: (
      tourId: number,
      stopId: number
    ): ComputedRef<{
      tourIndex: number;
      stopIndex: number;
    }> =>
      computed(() => selectors.selectTourAndStopIndex(state, tourId, stopId)),

    getStopIndex: (tourId: number, stopId: number) =>
      computed((): number => selectors.selectStopIndex(state, tourId, stopId)),

    getTourTitle: (tourId: number) =>
      computed(() => selectors.selectTourTitle(state, tourId)),

    getTourLanguages: (tourId: number) =>
      computed(() => selectors.selectTourLanguages(state, tourId)),

    getDefaultTourLanguage: (tourId: number) =>
      computed(() => selectors.selectDefaultTourLanguage(state, tourId)),

    getStageIndexById: (tourId: number, stopId: number, stageId: string) =>
      computed(() =>
        selectors.selectStageIndexById(state, tourId, stopId, stageId)
      ),

    getTourStopRoute: (tourId: number, stopId: number) =>
      computed(() => selectors.selectTourStopRoute(state, tourId, stopId)),

    getTourStopTargetPoint: (tourId: number, stopId: number) =>
      computed(() =>
        selectors.selectTourStopTargetPoint(state, tourId, stopId)
      ),

    getNextTourStop: (tourId: number, stopId: number) =>
      computed(() => selectors.selectNextTourStop(state, tourId, stopId)),

    getPrevTourStop: (tourId: number, stopId: number) =>
      computed(() => selectors.selectPrevTourStop(state, tourId, stopId)),

    getNextTourStopRoute: (tourId: number, stopId: number) =>
      computed(() => selectors.selectNextTourStopRoute(state, tourId, stopId)),

    getTourStopStartPoint: (tourId: number, stopId: number) =>
      computed(() => selectors.selectTourStopStartPoint(state, tourId, stopId)),

    getNextTourStopStartPoint: (tourId: number, stopId: number) =>
      computed(() =>
        selectors.selectNextTourStopStartPoint(state, tourId, stopId)
      ),
    findFirstValuedTargetPoint: (tourId: number) =>
      computed(() => selectors.findFirstValuedTargetPoint(state, tourId)),
    findValuedTargetPoint: (
      tourId: number | null | undefined,
      stopId: number | null | undefined
    ) => computed(() => selectors.findValuedTargetPoint(state, tourId, stopId)),
  };

  const actions = {
    async init() {
      await actions.fetchTours();
      state.isReady.value = true;
    },

    /**
     * fetches tours from the server and sets them in the store
     */
    async fetchTours(): Promise<Tour[]> {
      const res = await axios.get<Tour[]>("/creator");
      const tours = res.data;
      // make tours continous
      const normalizedTours = tours.map(normalizeTour);

      state.tours.value = normalizedTours;
      return res.data;
    },

    /**
     * creates a new tour and adds it to the store
     */
    async createTour(tour: Partial<Tour>): Promise<Tour> {
      try {
        const res = await axios.post<Tour>(
          "/creator/edit",
          mergeDeepRight(createDefaultTour(), tour)
        );
        state.tours.value.push(res.data);

        return res.data;
      } catch (err) {
        console.error(`Cannot create tour ${tour}`, err);
        throw err;
      }
    },

    /**
     * puts an updated tour on the server and updates the store
     */
    async updateTour(updatedTour: Tour): Promise<void> {
      const tourIndex = getters.getTourIndex(updatedTour.id);

      // optimistic updates
      const previousTour = state.tours.value[tourIndex.value];
      state.tours.value[tourIndex.value] = updatedTour;

      try {
        await axios.put<Tour, { data: string }>(
          `/creator/edit/${updatedTour.id}`,
          updatedTour
        );
      } catch (err) {
        console.error(`Cannot update tour: ${updatedTour}`, err);

        // rollback
        state.tours.value[tourIndex.value] = previousTour;
      }
      actions.fetchTours();
    },

    /**
     * deletes a tour from the server and removes it from the store
     */
    async deleteTour(tourId: number): Promise<void> {
      await axios
        .delete(`/creator/edit/${tourId}`)
        .catch((err) => console.error(`Cannot delete tour ${tourId}`, err));

      actions.fetchTours();
    },

    /**
     * posts a new tour stop to the server and adds it to the store
     */
    async createTourStop(
      tourId: number,
      stop: RecursivePartial<TourStop>
    ): Promise<TourStop> {
      const newStop = mergeDeepRight(createDefaultStop(), stop);

      try {
        const res = await axios.post<TourStop>(
          `/creator/edit/${tourId}/stop/`,
          newStop
        );
        actions.fetchTours();
        return res.data;
      } catch (err) {
        console.error(`Could not create new stop in tour ${tourId}`, err);
        // update tour cache
        actions.fetchTours();
        throw err;
      }
    },

    /**
     * puts an updated tour stop on the server and updates the store
     */
    async updateTourStop(tourId: number, stop: TourStop): Promise<TourStop> {
      if (!stop.id) throw Error("No stop id.");

      const { tourIndex, stopIndex } = getters.getTourAndStopIndex(
        tourId,
        stop.id
      ).value;

      // optimistic update
      const oldStop = state.tours.value[tourIndex].stops[stopIndex];

      state.tours.value[tourIndex].stops[stopIndex] = stop;

      return axios
        .put(`/creator/edit/${tourId}/stop/${stop.id}`, stop)
        .then((res) => {
          actions.fetchTours();
          return res.data;
        })
        .catch((err) => {
          console.error(
            `Cannot update tour stop. tourId: ${tourId}, stopId: ${stop.id}`,
            err
          );

          // rollback
          state.tours.value[tourIndex].stops[stopIndex] = oldStop;
          actions.fetchTours();
        });
    },

    /**
     * moves a tour stop to a new position
     */
    moveTourStopByIndex(
      tourId: number,
      oldStopIndex: number,
      newStopIndex: number
    ): void {
      const tourIndex = getters.getTourIndex(tourId);
      const prevTourStops = state.tours.value[tourIndex.value].stops;
      const updatedTourStops = move(oldStopIndex, newStopIndex, prevTourStops);
      state.tours.value[tourIndex.value].stops = updatedTourStops;
    },

    /**
     * inserts a given tour stop at a given position within a tour
     */
    insertTourStopAtIndex(tourId: number, stop: TourStop, index: number): void {
      const tourIndex = getters.getTourIndex(tourId);
      const prevTourStops = state.tours.value[tourIndex.value].stops;
      const updatedTourStops = insert(index, stop, prevTourStops);
      state.tours.value[tourIndex.value].stops = updatedTourStops;
    },

    /**
     * deletes a tour stop from the server and removes it from the store
     */
    async deleteTourStop(tourId, stopId): Promise<void> {
      const { tourIndex, stopIndex } = getters.getTourAndStopIndex(
        tourId,
        stopId
      ).value;

      // cache old stop in case we need to rollback
      const oldStop = state.tours.value[tourIndex].stops[stopIndex];

      // optimistic update
      state.tours.value[tourIndex].stops.splice(stopIndex, 1);

      axios
        .delete(`/creator/edit/${tourId}/stop/${stopId}`)
        .catch((err) => {
          console.error(
            `cannot delete tour stop with tourId ${tourId}, stopId: ${stopId}`,
            err
          );

          // rollback
          state.tours.value[tourIndex].stops = insert(
            stopIndex,
            oldStop,
            state.tours.value[tourIndex].stops
          );
        })
        .finally(() => actions.fetchTours());
    },

    /**
     * adds a header image to a given tour stop
     */
    addStopHeaderImage(tourId: number, stopId: number, image: Image) {
      const { tourIndex, stopIndex } = getters.getTourAndStopIndex(
        tourId,
        stopId
      ).value;
      state.tours.value[tourIndex].stops[stopIndex].stop_content.header_image =
        image;
    },

    /**
     * removes the stop header image from a given tour stop
     * and deletes the image from the server
     */
    deleteStopHeaderImage(tourId: number, stopId: number) {
      const { tourIndex, stopIndex } = getters.getTourAndStopIndex(
        tourId,
        stopId
      ).value;

      const tours = state.tours.value;
      const stop = tours[tourIndex].stops[stopIndex];
      const image = stop.stop_content.header_image;

      // if no header image found, we're done!
      if (!image) return;

      // optimistic update
      stop.stop_content.header_image = null;

      axios.delete(`/creator/image/${image.src}`).catch((err) => {
        console.error(`cannot delete image`, err);
        //rollback
        stop.stop_content.header_image = image;
      });
    },
    /**
     * updates a tour stop's stage within the store
     * Note: does not change the server. Use updateTourStop for that.
     */
    updateTourStopStage(tourId: number, stopId: number, stage: CoreStage) {
      const { tourIndex, stopIndex, stageIndex } = getters.getStageIndexById(
        tourId,
        stopId,
        stage.id
      ).value;
      state.tours.value[tourIndex].stops[stopIndex].stop_content.stages[
        stageIndex
      ] = stage;
    },
  };

  return {
    ...state,
    ...selectors,
    ...getters,
    ...actions,
  };
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useCreatorStore, import.meta.webpackHot)
  );
}
