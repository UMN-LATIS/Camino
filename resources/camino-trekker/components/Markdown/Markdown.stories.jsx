import Markdown from "./Markdown.vue";

export default {
  title: "Camino/Markdown",
  component: Markdown,
};

const Template = (args) => ({
  components: { Markdown },
  setup() {
    return { args };
  },
  template: `
    <Markdown v-bind="args" />
  `,
});

export const Default = Template.bind({});
Default.args = {
  content: `
  # Heading 1

  ## Heading 2

  ### Heading 3

  Aenean lacinia bibendum nulla sed consectetur. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.

  [This is a link.](https://www.google.com)

  \`\`\`js
  alert('Hello world!');
  \`\`\`

  > A blockquote
  `,
};
