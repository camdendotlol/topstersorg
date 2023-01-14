<script setup lang="ts">
import { useStore } from '../store'

const store = useStore()

store.watch(state => state.popupText, () => {
  // Make sure not to reset the popup when something else has been added.
  const oldText = store.state.popupText
  setTimeout(() => {
    if (store.state.popupText === oldText) {
      store.commit('setPopup', null)
    }
  }, 1500)
})
</script>

<template>
  <div id="popup" v-if="store.state.popupText">
    <p>{{ store.state.popupText }}</p>
  </div>
</template>

<style>
#popup {
  position: fixed;
  width: 200px;
  top: 70vh;
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
