export function createMultilingualText(languages = ["English"]) {
  return languages.reduce((acc, lang) => {
    acc[lang] = "";
    return acc;
  }, {});
}

const factories = {
  separator: ({ languages } = {}) => ({
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    type: "separator",
  }),

  navigation: ({ languages } = {}) => ({
    id: global.crypto.randomUUID(),
    text: createMultilingualText(languages),
    type: "navigation",
    targetPoint: null,
    route: [],
  }),

  // fallback for undefined types
  default: (type = "unknown") => ({
    id: global.crypto.randomUUID(),
    type,
  }),
};

export default {
  create: (type, opts) =>
    factories[type] ? factories[type](opts) : factories.default(type, opts),
};
