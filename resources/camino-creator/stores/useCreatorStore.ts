/* eslint-disable @typescript-eslint/no-this-alias */
import { mergeDeepRight, insert, move } from "ramda";
import { defineStore, acceptHMRUpdate } from "pinia";
import createDefaultStop from "../common/createDefaultStop";
import createDefaultTour from "../common/createDefaultTour";
import { Tour, Maybe, TourStop, Locale, LocalizedText } from "@/types";
import { axiosClient as axios } from "@creator/common/axios";

interface State {
  tours: Tour[];
  error: Maybe<Error>;
  isReady: boolean;
}

export const useCreatorStore = defineStore("creator", {
  state: (): State => ({
    tours: [],
    error: null,
    isReady: false,
  }),
  getters: {
    getTour:
      (state: State) =>
      (tourId: number): Tour => {
        const tour = state.tours.find((tour) => tour.id === tourId);
        if (!tour) {
          throw new Error(
            `a tour with id ${tourId} does not exist in the store`
          );
        }
        return tour;
      },
    getTourStop() {
      const store = this;
      return (tourId, stopId): TourStop => {
        const tour = store.getTour(tourId);
        const stop = tour.stops.find((stop) => stop.id === stopId);
        if (!stop) {
          throw new Error(
            `tour stop with tour id ${tourId} and stop id $${stopId} does not exist in the`
          );
        }
        return stop;
      };
    },
    getTourIndex() {
      const store = this;
      return (tourId: number): number => {
        const index = store.tours.findIndex((t) => t.id === tourId);
        if (index === -1) {
          throw new Error(`cannot find index of tourId: ${tourId}`);
        }
        return index;
      };
    },
    getTourAndStopIndex() {
      const store = this;
      return (
        tourId: number,
        stopId: number
      ): { tourIndex: number; stopIndex: number } => {
        const tourIndex = store.tours.findIndex((t) => t.id === tourId);
        if (tourIndex === -1) {
          throw new Error(`tour with id ${tourId} does not exist`);
        }

        const stopIndex = store.tours[tourIndex].stops.findIndex(
          (s) => s.id === stopId
        );
        if (stopIndex === -1) {
          throw new Error(`stop with id ${stopId} does not exist`);
        }
        return { tourIndex, stopIndex };
      };
    },
    getTourTitle() {
      const store = this;
      return (tourId: number): string => store.getTour(tourId).title;
    },
    getTourLanguages() {
      const store = this;
      return (tourId: number): Locale[] =>
        store.getTour(tourId).tour_content.languages;
    },
    getDefaultTourLanguage() {
      const store = this;
      return (tourId: number): Locale =>
        store.getTour(tourId).tour_content.languages[0] || Locale.en;
    },
  },
  actions: {
    async init() {
      await this.fetchTours();
      this.isReady = true;
    },

    async fetchTours(): Promise<Tour[]> {
      const res = await axios.get("/creator");
      this.tours = res.data;
      return res.data;
    },

    async createTour(tour: Tour): Promise<Tour> {
      // update store optimisticly
      this.tours.push(tour);
      try {
        const res = await axios.post<Tour>(
          "/creator/edit",
          mergeDeepRight(createDefaultTour(), tour)
        );
        return res.data;
      } catch (err) {
        console.error(`Cannot create tour ${tour}`, err);
        // rollback tours
        this.tours = this.tours.filter((t) => t !== tour);
        throw err;
      }
    },

    async updateTour(updatedTour: Tour): Promise<void> {
      const tourIndex = this.getTourIndex(updatedTour.id);

      // optimistic updates
      const previousTour = this.tours[tourIndex];
      this.tours[tourIndex] = updatedTour;

      try {
        await axios.put<Tour, { data: string }>(
          `/creator/edit/${updatedTour.id}`,
          updatedTour
        );
      } catch (err) {
        console.error(`Cannot update tour: ${updatedTour}`, err);

        // rollback
        this.tours[tourIndex] = previousTour;
      }
      this.fetchTours();
    },

    async deleteTour(tourId: number): Promise<void> {
      await axios
        .delete(`/creator/edit/${tourId}`)
        .catch((err) => console.error(`Cannot delete tour ${tourId}`, err));

      this.fetchTours();
    },

    async createTourStop(
      tourId: number,
      stopTitle: LocalizedText
    ): Promise<TourStop> {
      const newStop = mergeDeepRight(createDefaultStop(), {
        stop_content: {
          title: stopTitle,
        },
      });

      // optimistic update
      const tourIndex = this.getTourIndex(tourId);

      // add stop right before last stop
      const currentStops: TourStop[] = this.tours[tourIndex].stops;
      const updatedStops: TourStop[] = insert(
        currentStops.length - 2,
        newStop,
        currentStops
      );

      // update store
      this.tours[tourIndex].stops = updatedStops;

      try {
        const res = await axios.post<TourStop>(
          `/creator/edit/${tourId}/stop/`,
          newStop
        );

        // update tour cache
        this.fetchTours();

        return res.data;
      } catch (err) {
        console.error(`Could not create new stop in tour ${tourId}`, err);
        // rollback changes
        this.tours[tourIndex].stops = currentStops;

        // update tour cache
        this.fetchTours();

        throw err;
      }
    },

    async updateTourStop(tourId: number, stop: TourStop): Promise<TourStop> {
      const { tourIndex, stopIndex } = this.getTourAndStopIndex(
        tourId,
        stop.id
      );

      // optimistic update
      const oldStop = this.tours[tourIndex].stops[stopIndex];
      this.tours[tourIndex].stops[stopIndex] = stop;

      return axios
        .put(`/creator/edit/${tourId}/stop/${stop.id}`, stop)
        .then((res) => {
          this.fetchTours();
          return res.data;
        })
        .catch((err) => {
          console.error(
            `Cannot update tour stop. tourId: ${tourId}, stopId: ${stop.id}`,
            err
          );

          // rollback
          this.tours[tourIndex].stops[stopIndex] = oldStop;
          this.fetchTours();
        });
    },

    moveTourStopByIndex(
      tourId: number,
      oldStopIndex: number,
      newStopIndex: number
    ): void {
      const tourIndex = this.getTourIndex(tourId);
      const prevTourStops = this.tours[tourIndex].stops;
      const updatedTourStops = move(oldStopIndex, newStopIndex, prevTourStops);
      this.tours[tourIndex].stops = updatedTourStops;
    },

    insertTourStopAtIndex(tourId: number, stop: TourStop, index: number): void {
      const tourIndex = this.getTourIndex(tourId);
      const prevTourStops = this.tours[tourIndex].stops;
      const updatedTourStops = insert(index, stop, prevTourStops);
      this.tours[tourIndex].stops = updatedTourStops;
    },

    async deleteTourStop(tourId, stopId): Promise<void> {
      const { tourIndex, stopIndex } = this.getTourAndStopIndex(tourId, stopId);

      // cache old stop in case we need to rollback
      const oldStop = this.tours[tourIndex].stops[stopIndex];

      // optimistic update
      this.tours[tourIndex].stops.splice(stopIndex, 1);

      axios
        .delete(`/creator/edit/${tourId}/stop/${stopId}`)
        .catch((err) => {
          console.error(
            `cannot delete tour stop with tourId ${tourId}, stopId: ${stopId}`,
            err
          );

          // rollback
          this.tours[tourIndex].stops = insert(
            stopIndex,
            oldStop,
            this.tours[tourIndex].stops
          );
        })
        .finally(() => this.fetchTours());
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useCreatorStore, import.meta.webpackHot)
  );
}
