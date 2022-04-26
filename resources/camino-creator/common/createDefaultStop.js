export default () => ({
  id: null,
  stop_content: {
    title: {
      English: "",
    },
    subtitle: {
      English: "",
    },
    header_image: {
      src: null,
      alt: null,
    },
    stages: [
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "Navigation",
        },
        type: "separator",
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "",
        },
        type: "navigation",
        targetPoint: null,
        route: [],
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "Guide",
        },
        type: "separator",
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "",
        },
        type: "guide",
      },
    ],
  },
});
