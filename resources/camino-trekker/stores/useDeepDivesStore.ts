import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "@/shared/axios";
import { useTrekkerStore } from "./useTrekkerStore";
import { DeepDiveItem, DeepDiveStage } from "@/types";
import getStagesFromTourWhere from "@trekker/utils/getStagesFromTourWhere";

type SendStatus = "idle" | "pending" | "success" | "failure";

type DeepDiveItemWithSelectState = DeepDiveItem & { isSelected: boolean };

function selectAllDeepDivesFromTour(tour) {
  if (!tour) return [];
  const deepDiveStages = getStagesFromTourWhere<DeepDiveStage>(
    "type",
    "deepdives",
    tour
  );
  return deepDiveStages.flatMap((stage) => stage.deepdives);
}

export const useDeepDivesStore = defineStore("deepdives", {
  state: () => ({
    selectedDeepDiveIds: new Set() as Set<string>,
    email: "",
    sendStatus: "idle" as SendStatus,
    error: "",
  }),
  getters: {
    allDeepDives(): DeepDiveItemWithSelectState[] {
      const trekkerStore = useTrekkerStore();
      return selectAllDeepDivesFromTour(trekkerStore.tour).map((deepdive) => ({
        ...deepdive,
        isSelected: this.selectedDeepDiveIds.has(deepdive.id),
      }));
    },
    isSelected() {
      return (id: string): boolean => this.selectedDeepDiveIds.has(id);
    },
    areAllSelected(): boolean {
      return this.allDeepDives.length === this.selectedDeepDiveIds.size;
    },
    canSendEmail(): boolean {
      return (
        this.sendStatus !== "pending" &&
        this.selectedDeepDiveIds.size >= 1 &&
        this.email.length >= 3
      );
    },
  },
  actions: {
    addDeepDive(deepdive: DeepDiveItem) {
      this.selectedDeepDiveIds.add(deepdive.id);
    },
    selectAll() {
      this.allDeepDives.forEach((deepdive) =>
        this.selectedDeepDiveIds.add(deepdive.id)
      );
    },
    deselectAll() {
      this.selectedDeepDiveIds.clear();
    },
    toggle(id) {
      this.selectedDeepDiveIds.has(id)
        ? this.selectedDeepDiveIds.delete(id)
        : this.selectedDeepDiveIds.add(id);
    },
    toggleAll() {
      this.areAllSelected ? this.deselectAll() : this.selectAll();
    },
    removeDeepDive(deepdive: DeepDiveItem) {
      this.selectedDeepDiveIds.delete(deepdive.id);
    },
    softReset() {
      // keep selected deepdives, but clear email
      this.email = "";
      this.sendStatus = "idle";
    },
    emailDeepDives() {
      const { tourId, locale } = useTrekkerStore();
      this.sendStatus = "pending";

      axios
        .post(`/api/tour/${tourId}/deepdivesEmail`, {
          email: this.email,
          deepdiveIds: [...this.selectedDeepDiveIds],
          locale: locale,
        })
        .then(() => {
          this.sendStatus = "success";
        })
        .catch((err) => {
          this.sendStatus = "failure";
          this.error = `Error sending Deep Dives: ${err.message}`;
        });
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useDeepDivesStore, import.meta.webpackHot)
  );
}
