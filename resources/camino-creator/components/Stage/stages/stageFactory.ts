import { StageType } from "@/types";
import { createEmptyLocalizedText } from "@/shared/i18n";

const factories = {
  [StageType.AR]: ({ languages }) => ({
    type: StageType.AR,
    id: global.crypto.randomUUID(),
    text: createEmptyLocalizedText(languages),
    waypoints: [],
  }),

  [StageType.DeepDives]: () => ({
    type: StageType.DeepDives,
    id: global.crypto.randomUUID(),
    deepdives: [],
  }),

  [StageType.DeepDivesSummary]: ({ languages }) => ({
    type: StageType.DeepDivesSummary,
    id: global.crypto.randomUUID(),
    request_email: true,
    text: createEmptyLocalizedText(languages),
  }),

  [StageType.Guide]: ({ languages }) => ({
    type: StageType.Guide,
    id: global.crypto.randomUUID(),
    text: createEmptyLocalizedText(languages),
  }),

  [StageType.Feedback]: ({ languages }) => ({
    type: StageType.Feedback,
    id: global.crypto.randomUUID(),
    text: createEmptyLocalizedText(languages),
  }),

  [StageType.Gallery]: () => ({
    type: StageType.Gallery,
    id: global.crypto.randomUUID(),
    images: [],
  }),

  [StageType.Navigation]: ({ languages }) => ({
    type: StageType.Navigation,
    id: global.crypto.randomUUID(),
    text: createEmptyLocalizedText(languages),
    targetPoint: null,
    route: [],
  }),

  [StageType.Separator]: ({ languages }) => ({
    type: StageType.Separator,
    id: global.crypto.randomUUID(),
    text: createEmptyLocalizedText(languages),
  }),

  [StageType.Quiz]: ({ languages }) => ({
    type: StageType.Quiz,
    id: global.crypto.randomUUID(),
    questionText: createEmptyLocalizedText(languages),
    quizType: "multiple_choice",
    responses: [],
    hintText: createEmptyLocalizedText(languages),
  }),

  // fallback for undefined types
  default: (type = "unknown") => ({
    type,
    id: global.crypto.randomUUID(),
  }),
};

export default {
  create: (type, opts) =>
    factories[type] ? factories[type](opts) : factories.default(type),
};
