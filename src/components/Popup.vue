<script setup lang="ts">
import { watch } from 'vue'
import { useStore } from '../store'

const store = useStore()

// todo: make sure this works
watch(() => store.popupText, () => {
  // Make sure not to reset the popup when something else has been added.
  const oldText = store.popupText
  setTimeout(() => {
    if (store.popupText === oldText) {
      store.setPopup(null)
    }
  }, 1500)
})
</script>

<template>
  <div v-if="store.popupText" id="popup">
    <p>{{ store.popupText }}</p>
  </div>
</template>

<style>
#popup {
  position: fixed;
  width: 200px;
  top: 70dvh;
  left: calc(50vw - 100px);
  border-radius: 10px;
  background: rgba(100, 100, 100, 0.8);
  z-index: 100000;
  color: white;
  display: none;
}

p {
  margin: 10px;
}

@media screen and (max-width: 1000px) {
  #popup {
    display: initial;
  }
}
</style>
