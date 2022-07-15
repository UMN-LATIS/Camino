import { defineStore, acceptHMRUpdate } from "pinia";
import { useTrekkerStore } from "./useTrekkerStore";
// import { useStorage } from "@vueuse/core";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import { QuizStage, QuizChoice } from "@/types";
import getStagesFromTourWhere from "../utils/getStagesFromTourWhere";

type QuizStatus = "inactive" | "active" | "complete";

interface UserQuiz extends QuizStage {
  status: QuizStatus;
  submittedResponses: QuizChoice[];
  showHint: boolean;
}

interface QuizStoreState {
  /**
   * A collection of user quizzes, their status, and responses
   */
  quizzes: Record<string, UserQuiz>;
}

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizStoreState => {
    const trekkerStore = useTrekkerStore();
    if (!trekkerStore.tour) {
      throw new Error("cannot initialize quiz store before tour is loaded.");
    }
    const allQuizStages = getStagesFromTourWhere<QuizStage>(
      "type",
      "quiz",
      trekkerStore.tour
    );
    return {
      quizzes: allQuizStages.reduce(
        (acc, quiz) => ({
          ...acc,
          [quiz.id]: {
            ...quiz,
            status: "inactive",
            submittedResponses: [],
            showHint: false,
          },
        }),
        {}
      ),
    };
  },
  getters: {
    currentStopQuizIds(): string[] {
      const trekkerStore = useTrekkerStore();
      return getStagesFromStopWhere<QuizStage>(
        "type",
        "quiz",
        trekkerStore.currentStop
      ).map((quiz) => quiz.id);
    },
    currentStopQuizzes(state): UserQuiz[] {
      return this.currentStopQuizIds.map((quizId) => state.quizzes[quizId]);
    },
    currentStopQuizzesByStatus() {
      return (quizStatus: QuizStatus) =>
        this.currentStopQuizzes.filter((quiz) => quiz.status === quizStatus);
    },
    allCurrentStopQuizzesComplete(): boolean {
      return this.currentStopQuizzes.every(
        (quiz) => quiz.status === "complete"
      );
    },
  },
  actions: {
    setQuizStatus(quizStageId: string, status: QuizStatus) {
      this.quizzes[quizStageId].status = status;
    },
    startQuiz(quizStageId: string) {
      this.setQuizStatus(quizStageId, "active");
    },
    startCurrentStopQuizzes() {
      this.currentStopQuizIds.forEach((quizId) => this.startQuiz(quizId));
    },
    submitQuizResponse(quizStageId: string, response: QuizChoice) {
      // for now, we just check the response object itself it's correct
      // since this is low stakes and all client-side anyway
      // if things becomes higher stakes (aka gradebook integration)
      // then we should do an api call
      if (response.correct) {
        this.setQuizStatus(quizStageId, "complete");
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
