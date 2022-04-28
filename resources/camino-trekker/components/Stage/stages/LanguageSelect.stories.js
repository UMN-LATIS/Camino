import PureLanguageSelect from "./PureLanguageSelect.vue";

export default {
  title: "Camino/Stages/LanguageSelect",
  component: PureLanguageSelect,
};

const Template = (args) => ({
  components: { PureLanguageSelect },
  setup() {
    return { args };
  },
  template: `
    <PureLanguageSelect v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  locale: "en",
  locales: ["en", "es"],
};
