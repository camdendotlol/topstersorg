<template>
  <div class="modal-container">
    <div class="announcement-modal">
      <h1>{{ this.header }}</h1>
      <p>{{ this.message }}</p>
      <button
        class="ok-button"
        @click="this.$emit('toggleAnnouncement')"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      header: 'Ostrakon is now Topsters.org',
      message: 'If you want to access your old charts, you can still visit the old URL. Eventually, your charts will be copied over automatically.'
    }
  },
  emits: ['toggleAnnouncement']
})
</script>

<style scoped>
.modal-container {
  height: 100vh;
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
  background: #AAE5CA;
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
