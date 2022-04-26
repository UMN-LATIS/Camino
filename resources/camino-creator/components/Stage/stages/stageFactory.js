import { STAGE_TYPES } from "../../../common/constants.js";

export function createMultilingualText(languages = ["English"]) {
  return languages.reduce((acc, lang) => {
    acc[lang] = "";
    return acc;
  }, {});
}

const factories = {
  [STAGE_TYPES.SEPARATOR]: ({ languages } = {}) => ({
    type: STAGE_TYPES.SEPARATOR,
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
  }),

  [STAGE_TYPES.NAVIGATION]: ({ languages } = {}) => ({
    type: STAGE_TYPES.NAVIGATION,
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    targetPoint: null,
    route: [],
  }),

  [STAGE_TYPES.GUIDE]: ({ languages } = {}) => ({
    type: STAGE_TYPES.GUIDE,
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
  }),

  [STAGE_TYPES.AR]: ({ languages } = {}) => ({
    type: STAGE_TYPES.AR,
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    waypoints: [],
  }),

  [STAGE_TYPES.DEEPDIVES]: () => ({
    type: STAGE_TYPES.DEEPDIVES,
    id: global.crypto.randomUUID(),
    deepdives: [],
  }),

  // fallback for undefined types
  default: (type = "unknown") => ({
    type,
    id: global.crypto.randomUUID(),
  }),
};

export default {
  create: (type, opts) =>
    factories[type] ? factories[type](opts) : factories.default(type, opts),
};
