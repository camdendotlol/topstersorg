<script setup lang="ts">
const emit = defineEmits([
  'toggleAnnouncement'
])

const notice = {
  header: 'Ostrakon is now Topsters.org',
  message: 'It looks like this is your first time here, so you\'ve been automatically redirected. Welcome to the site!'
}
</script>

<template>
  <div class="modal-container">
    <div class="announcement-modal">
      <h1>{{ notice.header }}</h1>
      <p>{{ notice.message }}</p>
      <button
        class="ok-button"
        @click="emit('toggleAnnouncement')"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  height: 100dvh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-modal {
  position: absolute;
  background: var(--ui-bg);
  padding: 20px;
  border-radius: 20px;
  max-width: 500px;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.ok-button {
  background: #00A8B3;
  border: none;
  border-radius: 10px;
  padding: 10px;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  max-width: 60px;
}

h1 {
  font-size: 2rem;
}

p {
  font-size: 1.2rem;
}
</style>
