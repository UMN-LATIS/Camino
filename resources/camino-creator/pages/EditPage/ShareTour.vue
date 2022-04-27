<template>
  <form class="my-4" @submit.prevent="handleShare">
    <div class="form-group row">
      <label for="sharing" class="col-sm-2">Sharing</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input
            id="sharing"
            v-model="emailToShareWith"
            type="email"
            class="form-control"
            aria-describedby="helpId"
            name="email"
            placeholder="email@example.com"
          />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit">
              Share
            </button>
          </div>
        </div>
        <ErrorAlert v-if="error" class="my-2">
          {{ error }}
        </ErrorAlert>
        <strong v-if="invitationSent">Invitation Sent</strong>
        <!-- show users list if there's more than just the tour owner -->
        <div v-if="users.length > 1">
          <p class="mb-0">Shared With:</p>
          <ul class="mt-0">
            <li v-for="user in users" :key="user.email">{{ user.email }}</li>
          </ul>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import ErrorAlert from "../../components/ErrorAlert.vue";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  tourId: {
    type: Number,
    required: true,
  },
});

const emailToShareWith = ref("");
const invitationSent = ref(false);
const error = ref(null);

const emit = defineEmits(["update:users"]);

function handleShare() {
  error.value = null;
  axios
    .post(`/creator/${props.tourId}/share`, {
      email: emailToShareWith.value,
    })
    .then(() => {
      emit("update:users", {
        email: emailToShareWith.value,
      });

      emailToShareWith.value = "";
      invitationSent.value = true;
      setTimeout(() => {
        invitationSent.value = false;
      }, 2000);
    })
    .catch((err) => {
      console.error(err);
      error.value = err;
    });
}
</script>
