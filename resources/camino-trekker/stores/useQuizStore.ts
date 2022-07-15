import { defineStore, acceptHMRUpdate } from "pinia";
import { useTrekkerStore } from "./useTrekkerStore";
// import { useStorage } from "@vueuse/core";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import { QuizStage, QuizChoice } from "@/types";

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
  attempts: Record<string, QuizAttempt>;
}

type QuizStageWithAttempt = QuizStage & QuizAttempt;

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizStoreState => {
    return {
      attempts: {},
    };
  },
  getters: {
    currentStopQuizzes(state): QuizStageWithAttempt[] {
      const trekkerStore = useTrekkerStore();
      const quizStages = getStagesFromStopWhere<QuizStage>(
        "type",
        "quiz",
        trekkerStore.currentStop
      );
      return quizStages.map((quiz: QuizStage) => ({
        ...quiz,
        ...state.attempts[quiz.id],
      }));
    },
    getStatus:
      (state) =>
      (quizId: string): QuizStatus =>
        state.attempts[quizId].status,
  },
  actions: {
    setQuizStatus(quizStageId: string, status: QuizStatus) {
      this.attempts[quizStageId].status = status;
    },
    startQuiz(quizStageId: string) {
      this.attempts[quizStageId] = stubQuizAttempt();
      this.setQuizStatus(quizStageId, "active");
    },
    submitQuizResponse(quizStageId: string, response: QuizChoice) {
      // for now, we just check the response object itself it's correct
      // since this is low stakes and all client-side anyway
      // if things becomes higher stakes (aka gradebook integration)
      // then we should do an api call
      if (response.correct) {
        this.setQuizStatus(quizStageId, "complete");
      }
      this.attempts[quizStageId].submittedResponses.push(response);
    },
    showHint(quizStageId: string) {
      this.attempts[quizStageId].showHint = true;
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useQuizStore, import.meta.webpackHot)
  );
}
