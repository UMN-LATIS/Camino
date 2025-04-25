import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "@/shared/axios";
import { useTrekkerStore } from "./useTrekkerStore";
import { DeepDiveItem, DeepDiveStage } from "@/types";
import getStagesFromTourWhere from "@trekker/utils/getStagesFromTourWhere";
import { useStorage } from "@vueuse/core";

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
  state: () => {
    const { tourId } = useTrekkerStore();
    const storageKey = `camino.trekker.tour-${tourId}.deepDivesStore`;
    return {
      selectedDeepDiveIds: useStorage<string[]>(
        `${storageKey}.selectedDeepDiveIds`,
        []
      ),
      email: "",
      sendStatus: "idle" as SendStatus,
      error: "",
    };
  },
  getters: {
    allDeepDives(): DeepDiveItemWithSelectState[] {
      const trekkerStore = useTrekkerStore();
      return selectAllDeepDivesFromTour(trekkerStore.tour).map((deepdive) => ({
        ...deepdive,
        isSelected: this.selectedDeepDiveIds.includes(deepdive.id),
      }));
    },
    isSelected() {
      return (id: string): boolean => this.selectedDeepDiveIds.includes(id);
    },
    areAllSelected(): boolean {
      return this.allDeepDives.length === this.selectedDeepDiveIds.length;
    },
    canSendEmail(): boolean {
      return (
        this.sendStatus !== "pending" &&
        this.selectedDeepDiveIds.length >= 1 &&
        this.email.length >= 3
      );
    },
  },
  actions: {
    addDeepDive(deepdiveId: string) {
      if (this.selectedDeepDiveIds.includes(deepdiveId)) return;
      this.selectedDeepDiveIds.push(deepdiveId);
    },
    removeDeepDive(deepdiveId: string) {
      this.selectedDeepDiveIds = this.selectedDeepDiveIds.filter(
        (id) => id !== deepdiveId
      );
    },
    selectAll() {
      this.selectedDeepDiveIds = this.allDeepDives.map(
        (deepdive) => deepdive.id
      );
    },
    deselectAll() {
      this.selectedDeepDiveIds = [];
    },
    toggle(id) {
      this.selectedDeepDiveIds.includes(id)
        ? this.removeDeepDive(id)
        : this.addDeepDive(id);
    },
    toggleAll() {
      this.areAllSelected ? this.deselectAll() : this.selectAll();
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
          deepdiveIds: this.selectedDeepDiveIds,
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
