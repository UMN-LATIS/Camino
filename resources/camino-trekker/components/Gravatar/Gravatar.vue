<template>
  <div
    class="gravatar"
    :class="{
      'gravatar--small': variant === 'small',
      'gravatar--large': variant === 'large',
    }"
  >
    {{ name.charAt(0) }}
    <img
      v-if="email"
      :src="`https://www.gravatar.com/avatar/${emailHash}?s=${size}`"
      :alt="name"
    />
  </div>
</template>
<script setup>
import { computed } from "vue";
import md5 from "md5";

const props = defineProps({
  email: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 200,
  },
  variant: {
    type: String,
    default: "medium",
  },
});

// see: https://en.gravatar.com/site/implement/hash/
const toHash = (str) => md5(str.trim().toLowerCase());
const emailHash = computed(() => toHash(props.email));
</script>
<style scoped>
.gravatar {
  --size: 3rem;
  height: var(--size);
  width: var(--size);
  border-radius: 50%;
  overflow: hidden;
}

.gravatar--small {
  --size: 2rem;
}
.gravatar--large {
  --size: 4rem;
}

.gravatar img {
  max-width: 100%;
}
</style>
