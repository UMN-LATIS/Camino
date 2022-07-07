import { ref } from "vue";
import Sheet from "../Sheet/Sheet.vue";
import Button from "../Button/Button.vue";

export default {
  title: "Camino/Sheet",
  component: Sheet,
  argTypes: {
    icon: {
      type: "string",
    },
    alt: {
      type: "string",
    },
  },
};

const Template = (args) => ({
  components: { Sheet, Button },
  setup() {
    const isOpen = ref(true);
    const toggleSheet = () => {
      isOpen.value = !isOpen.value;
    };

    return { args, isOpen, toggleSheet };
  },
  template: `
    <div>
      <Button @click="toggleSheet">Toggle Sheet</Button>
      <Sheet v-bind="args" :isOpen="isOpen" @close="toggleSheet">
        <p>Donec sed odio dui. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Maecenas faucibus mollis interdum. Nulla vitae elit libero, a pharetra augue. Nulla vitae elit libero, a pharetra augue.</p>
      </Sheet>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  title: "Modal Sheet",
};
