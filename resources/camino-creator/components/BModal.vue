<template>
  <div class="b-modal">
    <Teleport to="body">
      <div
        :id="id"
        class="modal"
        tabindex="-1"
        :aria-labelledby="`${id}-title`"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 :id="`${id}-title`" class="modal-title">{{ title }}</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="$emit('close')"
              ></button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string;
    title?: string;
  }>(),
  {
    id: crypto.randomUUID(),
    title: "Modal Title",
  }
);

defineEmits<{
  (eventName: "close");
}>();
</script>
<style scoped></style>
