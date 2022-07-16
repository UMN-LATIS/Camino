import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import type {
  Tour,
  UserQuizLookup,
  UserQuizByStopLookup,
  QuizStage,
} from "@/types";

export default function getQuizzesFromTour(tour: Tour): {
  quizzes: UserQuizLookup;
  quizIdsByStopIndex: UserQuizByStopLookup;
} {
  const quizzes: UserQuizLookup = {};
  const quizIdsByStopIndex: UserQuizByStopLookup = {};
  tour.stops.forEach((stop, index) => {
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
    quizzes,
    quizIdsByStopIndex,
  };
}
