import AppHeader from "./AppHeader.vue";
import umnLogo from "../../assets/umn-logo.svg";

export default {
  title: "Camino/AppHeader",
  component: AppHeader,
};

const Template = (args) => ({
  components: { AppHeader },
  setup() {
    return { args, umnLogo };
  },
  template: `
    <AppHeader v-bind="args" >
      <img :src="umnLogo" alt="University of Minnesota">
      <h1>Camino</h1>
    </AppHeader>
  `,
});

export const Default = Template.bind({});
Default.args = {};
