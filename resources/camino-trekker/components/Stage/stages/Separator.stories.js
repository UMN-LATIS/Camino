import Separator from "./Separator.vue";

export default {
  title: "Camino/Stages/Separator",
  component: Separator,
};

const Template = (args) => ({
  components: { Separator },
  setup() {
    return { args };
  },
  template: `
      <Separator v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  stage: {
    text: { en: "Get your bearings" },
    type: "separator",
  },
  locale: "en",
};
