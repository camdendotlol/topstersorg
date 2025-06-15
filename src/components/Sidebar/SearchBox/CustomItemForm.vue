<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits([
  'updateResults',
])

const title = ref('')
const creator = ref('')
const url = ref('')

function buildResultItem() {
  if (url.value) {
    const item = {
      title: title.value,
      creator: creator.value,
      imageURL: url.value,
      type: 'custom',
    }

    emit('updateResults', [item])
  }
}
</script>

<template>
  <div id="custom-form">
    <div class="custom-form-item">
      <label for="custom-image-url">
        Image Link
      </label>
      <input
        id="custom-image-url"
        v-model="url"
        required
        type="text"
      >
    </div>
    <div class="custom-form-item">
      <label for="custom-image-title">
        Title
      </label>
      <input
        id="custom-image-title"
        v-model="title"
        type="text"
      >
    </div>
    <div class="custom-form-item">
      <label for="custom-image-creator">
        Creator (Optional)
      </label>
      <input
        id="custom-image-creator"
        v-model="creator"
        type="text"
      >
    </div>
    <button
      @click="buildResultItem"
    >
      Generate chart item
    </button>
  </div>
</template>

<style scoped>
#custom-form {
  display: flex;
  flex-flow: column;
  gap: 10px;
}

#custom-form button {
  margin: auto;
  font-size: 1rem;
}

.custom-form-item label {
  display: block;
  font-size: 0.8rem;
}

.custom-form-item input {
  width: 100%;
}
</style>
