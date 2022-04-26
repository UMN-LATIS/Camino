export function createMultilingualText(languages = ["English"]) {
  return languages.reduce((acc, lang) => {
    acc[lang] = "";
    return acc;
  }, {});
}

const factories = {
  separator: ({ languages } = {}) => ({
    type: "separator",
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
  }),

  navigation: ({ languages } = {}) => ({
    type: "navigation",
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    targetPoint: null,
    route: [],
  }),

  guide: ({ languages } = {}) => ({
    type: "guide",
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
  }),

  ar: ({ languages } = {}) => ({
    type: "ar",
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    waypoints: [],
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
