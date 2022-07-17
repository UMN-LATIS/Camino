import { defineStore, acceptHMRUpdate } from "pinia";
import { useTrekkerStore } from "./useTrekkerStore";
import { QuizChoice, UserQuiz } from "@/types";
import { useStorage } from "@vueuse/core";
import getQuizzesFromTour from "../utils/getQuizzesFromTour";

export const useQuizStore = defineStore("quizzes", {
  state: () => {
    const trekkerStore = useTrekkerStore();
    if (!trekkerStore.tour) {
      throw new Error("cannot initialize quiz store before tour is loaded.");
    }

    const { quizzes, quizIdsByStopIndex } = getQuizzesFromTour(
      trekkerStore.tour
    );

    return {
      quizzes: useStorage("camino.trekker.quizStore.quizzes", quizzes),
      quizIdsByStopIndex: useStorage(
        "camino.trekker.quizStore.quizIdsByStopIndex",
        quizIdsByStopIndex
      ),
    };
  },
  getters: {
    currentStopQuizIds(state): string[] {
      const trekkerStore = useTrekkerStore();
      return state.quizIdsByStopIndex[trekkerStore.stopIndex];
    },
    currentStopQuizzes(state): UserQuiz[] {
      return this.currentStopQuizIds.map((quizId) => state.quizzes[quizId]);
    },
    allCurrentStopQuizzesComplete(): boolean {
      return this.currentStopQuizzes.every((quiz) => quiz.isComplete);
    },
  },
  actions: {
    markQuizComplete(quizStageId: string) {
      this.quizzes[quizStageId].isComplete = true;
    },
    submitQuizResponse(quizStageId: string, response: QuizChoice) {
      if (response.correct) {
        this.markQuizComplete(quizStageId);
      }
      this.quizzes[quizStageId].submittedResponses.push(response);
    },
    showHint(quizStageId: string) {
      this.quizzes[quizStageId].showHint = true;
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useQuizStore, import.meta.webpackHot)
  );
}
