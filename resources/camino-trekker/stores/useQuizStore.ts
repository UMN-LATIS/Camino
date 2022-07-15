import { defineStore, acceptHMRUpdate } from "pinia";
import { useTrekkerStore } from "./useTrekkerStore";
// import { useStorage } from "@vueuse/core";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import { QuizStage, QuizChoice, Maybe } from "@/types";
import getStagesFromTourWhere from "../utils/getStagesFromTourWhere";

type QuizStatus = "inactive" | "active" | "complete";

interface QuizAttempt {
  status: QuizStatus;
  submittedResponses: QuizChoice[];
  showHint: boolean;
}

const stubQuizAttempt = (): QuizAttempt => ({
  status: "inactive",
  submittedResponses: [],
  showHint: false,
});

interface QuizStoreState {
  //** a quiz should exist in the store for each quiz in this tour */
  isReady: boolean;
  // it's possible that they key doesn't exist, which is why we use partial
  attempts: Partial<Record<string, QuizAttempt>>;
}

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizStoreState => {
    return {
      isReady: false,
      attempts: {},
    };
  },
  getters: {
    currentStopQuizzes(): QuizStage[] {
      const trekkerStore = useTrekkerStore();
      return getStagesFromStopWhere<QuizStage>(
        "type",
        "quiz",
        trekkerStore.currentStop
      );
    },
    getQuizStatus:
      (state) =>
      (quizId: string): Maybe<QuizStatus> => {
        return state.attempts[quizId]?.status ?? null;
      },
  },
  actions: {
    init() {
      if (this.isReady) return;

      const trekkerStore = useTrekkerStore();
      if (!trekkerStore.tour) {
        throw new Error("cannot initialize quiz store before tour is loaded.");
      }
      const allQuizStages = getStagesFromTourWhere<QuizStage>(
        "type",
        "quiz",
        trekkerStore.tour
      );

      // stub each tour in the store so that we can look up status
      allQuizStages.forEach((quiz) => {
        if (this.attempts[quiz.id]) return;
        this.attempts[quiz.id] = stubQuizAttempt();
      });
      this.isReady = true;
    },
    setQuizStatus(quizStageId: string, status: QuizStatus) {
      const quizAttempt = this.attempts[quizStageId];
      if (!quizAttempt) {
        throw new Error(
          `cannot set quiz status for quizId: ${quizStageId}. No quiz exists in store.`
        );
      }
      quizAttempt.status = status;
    },
    startQuiz(quizStageId: string) {
      const quizAttempt = this.attempts[quizStageId];
      if (!quizAttempt) {
        throw new Error(
          `cannot start quiz ${quizStageId}. No quiz exists in store.`
        );
      }
      this.setQuizStatus(quizStageId, "active");
    },
    submitQuizResponse(quizStageId: string, response: QuizChoice) {
      const quizAttempt = this.attempts[quizStageId];
      if (!quizAttempt) {
        throw new Error(
          `cannot submit response for quiz ${quizStageId}. No quiz exists in store.`
        );
      }

      // for now, we just check the response object itself it's correct
      // since this is low stakes and all client-side anyway
      // if things becomes higher stakes (aka gradebook integration)
      // then we should do an api call
      if (response.correct) {
        this.setQuizStatus(quizStageId, "complete");
      }
      quizAttempt.submittedResponses.push(response);
    },
    showHint(quizStageId: string) {
      const quizAttempt = this.attempts[quizStageId];
      if (!quizAttempt) {
        throw new Error(
          `cannot show hint for quiz ${quizStageId}. No quiz exists in store.`
        );
      }
      quizAttempt.showHint = true;
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useQuizStore, import.meta.webpackHot)
  );
}
