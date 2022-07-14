import Gravatar from "../Gravatar/Gravatar.vue";

export default {
  title: "Camino/Gravatar",
  component: Gravatar,
  argTypes: {
    variant: {
      options: ["small", "medium", "large"],
      control: "radio",
    },
  },
};

const Template = (args) => ({
  components: { Gravatar },
  setup() {
    return { args };
  },
  template: `
    <Gravatar v-bind="args">
  `,
});

export const Default = Template.bind({});
Default.args = {
  email: "johnsojr@gmail.com",
  name: "James Johnson",
};
