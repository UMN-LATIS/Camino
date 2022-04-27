import StopHeader from "../StopHeader/StopHeader.vue";

export default {
  title: "Camino/StopHeader",
  component: StopHeader,
};

const Template = (args) => ({
  components: { StopHeader },
  setup() {
    return { args };
  },
  template: `<StopHeader v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {
  title: "Stop Title Goes Here",
  subtitle: "Ca-ca-ca-ca-ca-catmandooooo, Nepal",
  stopNumber: 99,
  imageSrc:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Lynx_kitten.jpg/1920px-Lynx_kitten.jpg",
  imageAlt: "Lynx Kitten. Aww so cute!",
};
