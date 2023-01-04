<template>
  <div id="popup" v-if="text">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { State } from '../store'
import { defineComponent } from 'vue'
import { mapMutations, mapState } from 'vuex'

export default defineComponent({
  methods: {
    ...mapMutations([
      'setPopup'
    ])
  },
  watch: {
    text () {
      // Make sure not to reset the popup when something else has been added.
      const oldText = this.text
      setTimeout(() => {
        if (this.text === oldText) {
          this.setPopup(null)
        }
      }, 1500)
    }
  },
  computed: {
    ...mapState({
      text: state => (state as State).popupText
    })
  }
})
</script>

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
