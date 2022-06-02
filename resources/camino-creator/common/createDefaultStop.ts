import { StageType, TourStop } from "@/types";

export default (): Partial<TourStop> => ({
  stop_content: {
    title: {
      English: "",
    },
    subtitle: {
      English: "",
    },
    header_image: null,
    stages: [
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "Navigation",
        },
        type: StageType.Separator,
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "",
        },
        type: StageType.Navigation,
        targetPoint: null,
        route: [],
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "Guide",
        },
        type: StageType.Separator,
      },
      {
        id: global.crypto.randomUUID(),
        text: {
          English: "",
        },
        type: StageType.Guide,
      },
    ],
  },
});
