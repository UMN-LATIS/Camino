import { ref } from "vue";
import MenuSheet from "../MenuSheet/MenuSheet.vue";
import Button from "../Button/Button.vue";

export default {
  title: "Camino/MenuSheet",
  component: MenuSheet,
};

const Template = (args) => ({
  components: { MenuSheet, Button },
  setup() {
    const isOpen = ref("true");
    const toggleSheet = () => {
      isOpen.value = !isOpen.value;
    };
    return {
      args,
      isOpen,
      toggleSheet,
    };
  },
  template: `
    <div>
      <Button @click="toggleSheet">Toggle Sheet</Button>
      <MenuSheet :isOpen="isOpen" @close="toggleSheet" v-bind="args"  />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};
