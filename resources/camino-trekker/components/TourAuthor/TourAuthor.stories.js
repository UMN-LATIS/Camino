import TourAuthor from "../TourAuthor/TourAuthor.vue";

export default {
  title: "Camino/TourAuthor",
  component: TourAuthor,
};

const Template = (args) => ({
  components: { TourAuthor },
  setup() {
    return { args };
  },
  template: `
    <TourAuthor v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  author: {
    name: "James Johnson",
    title: "Tour Guide",
    email: "johnsojr@gmail.com",
    institution: "University of Minnesota",
  },
};
