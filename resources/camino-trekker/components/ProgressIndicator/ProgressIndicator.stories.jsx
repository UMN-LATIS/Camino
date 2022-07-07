import ProgressIndicator from "../ProgressIndicator/ProgressIndicator.vue";

export default {
  title: "Camino/ProgressIndicator",
  component: ProgressIndicator,
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "var(--black)" }],
    },
  },
};

const Template = (args) => ({
  components: { ProgressIndicator },
  setup() {
    return { args };
  },
  template: `<ProgressIndicator v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {
  active: 3,
  total: 10,
};
