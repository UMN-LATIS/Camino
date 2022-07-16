import { defineStore, acceptHMRUpdate } from "pinia";
import { useTrekkerStore } from "./useTrekkerStore";
// import { useStorage } from "@vueuse/core";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import { QuizStage, QuizChoice, UserQuiz } from "@/types";

type StopIndex = number;
type QuizStageId = string;

interface QuizStoreState {
  /**
   * A collection of user quizzes, their status, and responses
   */
  isQuizModalOpen: boolean;
  quizzes: Record<string, UserQuiz>;
  quizIdsByStopIndex: Record<StopIndex, QuizStageId[]>;
}

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizStoreState => {
    const trekkerStore = useTrekkerStore();
    if (!trekkerStore.tour) {
      throw new Error("cannot initialize quiz store before tour is loaded.");
    }

    const quizzes: Record<QuizStageId, UserQuiz> = {};
    const quizIdsByStopIndex: Record<StopIndex, QuizStageId[]> = {};

    trekkerStore.tour.stops.forEach((stop, index) => {
      const stopQuizStages = getStagesFromStopWhere<QuizStage>(
        "type",
        "quiz",
        stop
      );

      // if no quizzes at this stop,
      // just add an empty array to our index of quizzes
      // and carry on
      if (!stopQuizStages.length) {
        quizIdsByStopIndex[index] = [];
        return;
      }

      // otherwise add these stages to our list
      // with a few extra bits to make them a UserQuiz
      stopQuizStages.forEach((stage) => {
        quizzes[stage.id] = {
          ...stage,
          isComplete: false,
          submittedResponses: [],
          showHint: false,
        };
      });

      // and add a list of all quizzes within this stop
      // for stop lookup later
      quizIdsByStopIndex[index] = stopQuizStages.map((s) => s.id);
    });

    return {
      isQuizModalOpen: false,
      quizzes,
      quizIdsByStopIndex,
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
      // for now, we just check the response object itself it's correct
      // since this is low stakes and all client-side anyway
      // if things becomes higher stakes (aka gradebook integration)
      // then we should do an api call
      if (response.correct) {
        this.markQuizComplete(quizStageId);
      }
      this.quizzes[quizStageId].submittedResponses.push(response);
    },
    showHint(quizStageId: string) {
      this.quizzes[quizStageId].showHint = true;
    },
    openQuizModal() {
      this.isQuizModalOpen = true;
    },
    closeQuizModal() {
      this.isQuizModalOpen = false;
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useQuizStore, import.meta.webpackHot)
  );
}
