import { ref, type ComputedRef, computed } from "vue";
import { mergeDeepRight, insert, move } from "ramda";
import { defineStore, acceptHMRUpdate } from "pinia";
import createDefaultStop from "../common/createDefaultStop";
import createDefaultTour from "../common/createDefaultTour";
import { axiosClient as axios } from "@creator/common/axios";
import { Locale } from "@/types";
import type { Tour, TourStop, Stage, Image, RecursivePartial } from "@/types";

export const useCreatorStore = defineStore("creator", () => {
  const state = {
    tours: ref<Tour[]>([]),
    error: ref<string | null>(null),
    isReady: ref<boolean>(false),
  };

  const getters = {
    /**
     * Get a tour by id
     */
    getTour: (tourId: number) =>
      computed((): Tour => {
        const tour = state.tours.value.find((tour) => tour.id === tourId);
        if (!tour) {
          throw new Error(
            `a tour with id ${tourId} does not exist in the store`
          );
        }
        return tour;
      }),

    /**
     * get a tour stop by tour id and stop id
     */
    getTourStop: (tourId: number, stopId: number) =>
      computed((): TourStop => {
        const tour = getters.getTour(tourId);
        const stop = tour.value.stops.find((stop) => stop.id === stopId);
        if (!stop) {
          throw new Error(
            `tour stop with tour id ${tourId} and stop id $${stopId} does not exist in the`
          );
        }
        return stop;
      }),

    /**
     * gets the index of a tour in the store.tours array
     */
    getTourIndex: (tourId: number) =>
      computed((): number => {
        const index = state.tours.value.findIndex((t) => t.id === tourId);
        if (index === -1) {
          throw new Error(`cannot find index of tourId: ${tourId}`);
        }
        return index;
      }),

    /**
     * gets the location of a tour stop by index in store.tours
     * that is, it gets index of tour in `store.tours`
     * and then the index of the stop in
     * `store.tours[tourIndex].stops`
     */
    getTourAndStopIndex: (
      tourId: number,
      stopId: number
    ): ComputedRef<{
      tourIndex: number;
      stopIndex: number;
    }> =>
      computed(() => {
        const tourIndex = getters.getTourIndex(tourId).value;
        const stopIndex = state.tours.value[tourIndex].stops.findIndex(
          (stop) => stop.id === stopId
        );
        if (stopIndex === -1) {
          throw new Error(`stop with id ${stopId} does not exist`);
        }
        return {
          tourIndex,
          stopIndex,
        };
      }),

    /**
     * gets the title of a tour
     **/
    getTourTitle: (tourId: number) =>
      computed((): string => getters.getTour(tourId).value.title),

    /**
     * gets supported languages for a given tour
     */
    getTourLanguages: (tourId: number) =>
      computed(
        (): Locale[] => getters.getTour(tourId).value.tour_content.languages
      ),

    /**
     * gets the first supported language for a given tour
     * if no languages are supported, defaults to english
     */
    getDefaultTourLanguage: (tourId: number) =>
      computed(
        (): Locale =>
          getters.getTour(tourId).value.tour_content.languages[0] || Locale.en
      ),

    /**
     * gets index of a stage by its stage id
     */
    getStageIndexById: (
      tourId: number,
      stopId: number,
      stageId: string
    ): ComputedRef<{
      tourIndex: number;
      stopIndex: number;
      stageIndex: number;
    }> =>
      computed(() => {
        const { tourIndex, stopIndex } = getters.getTourAndStopIndex(
          tourId,
          stopId
        ).value;
        const stageIndex = state.tours.value[tourIndex].stops[
          stopIndex
        ].stop_content.stages.findIndex((s) => s.id === stageId);

        if (stageIndex === -1) {
          throw new Error(`Cannot find stage with id ${stageId}`);
        }

        return {
          tourIndex,
          stopIndex,
          stageIndex,
        };
      }),
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
      const res = await axios.get("/creator");
      state.tours.value = res.data;
      return res.data;
    },

    /**
     * creates a new tour and adds it to the store
     */
    async createTour(tour: Tour): Promise<Tour> {
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
      const image =
        state.tours[tourIndex].stops[stopIndex].stop_content.header_image;

      // if no header image found, we're done!
      if (!image) return;

      // optimistic update
      state.tours[tourIndex].stops[stopIndex].stop_content.header_image = null;

      axios.delete(`/creator/image/${image.src}`).catch((err) => {
        console.error(`cannot delete image`, err);
        //rollback
        state.tours[tourIndex].stops[stopIndex].stop_content.header_image =
          image;
      });
    },
    /**
     * updates a tour stop's stage within the store
     * Note: does not change the server. Use updateTourStop for that.
     */
    updateTourStopStage(tourId: number, stopId: number, stage: Stage) {
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
