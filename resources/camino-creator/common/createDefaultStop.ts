import { StageType, TourStop } from "@/types";
import { Locale } from "@/types";

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
        type: StageType.Separator,
        id: crypto.randomUUID(),
        text: {
          [Locale.en]: "Navigation",
        },
      },
      {
        id: crypto.randomUUID(),
        text: {
          [Locale.en]: "",
        },
        type: StageType.Navigation,
        targetPoint: null,
        route: [],
      },
      {
        id: crypto.randomUUID(),
        text: {
          English: "Guide",
        },
        type: StageType.Separator,
      },
      {
        id: crypto.randomUUID(),
        text: {
          English: "",
        },
        type: StageType.Guide,
      },
    ],
  },
});
