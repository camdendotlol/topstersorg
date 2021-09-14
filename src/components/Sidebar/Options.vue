<template>
  <div id="chart-options">
    <h2>Options</h2>
    <div class="form-option">
      <label for="chart-size">Size</label>
      <input
        min=1
        max=10
        type="number"
        name="x-axis"
        class="dimension-input"
      >
      <input
        min=1
        max=10
        type="number"
        name="y-axis"
        class="dimension-input"
      >
    </div>
    <div class="form-option">
      <label for="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        @change="updateTitle"
      >
    </div>
    <div class="form-option">
      <label for="background-color">Background color</label>
      <input type="text" name="background-color" id="background-color">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapMutations } from 'vuex'

export default defineComponent({
  methods: {
    ...mapMutations([
      'changeTitle'
    ]),
    updateTitle (event: Event): void {
      const title = (event.target as HTMLFormElement).value
      return this.changeTitle(title)
    }
  }
})
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 5px;
}

input {
  margin-left: 10px;
  border: 2px solid #00003f;
}

.dimension-input {
  width: 40px;
}

h2 {
  margin-top: 10px;
  margin-bottom: 5px;
}

#chart-options {
  display: flex;
  flex-flow: column;
  gap: 10px;
}

select {
  padding: 5px;
  font-size: 1rem;
  border: 2px solid #00003f;
  border-radius: 5px;
  background: #e9e9e9;
}
</style>
