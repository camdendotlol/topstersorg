<template>
  <div id="chart-options">
    <h2>Options</h2>
    <div class="form-option">
      <label for="chart-size">Size</label>
      <input
        min=1
        max=10
        value=5
        type="number"
        name="x-axis"
        class="dimension-input"
        @change="updateSizeX"
      >
      <input
        min=1
        max=10
        value=5
        type="number"
        name="y-axis"
        class="dimension-input"
        @change="updateSizeY"
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
      <input
        type="color"
        name="background-color"
        id="background-color"
        @change="updateColor"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapMutations } from 'vuex'

export default defineComponent({
  methods: {
    ...mapMutations([
      'changeTitle',
      'changeColor',
      'changeSize'
    ]),
    updateTitle (event: Event): void {
      const title = (event.target as HTMLFormElement).value
      return this.changeTitle(title)
    },
    updateColor (event: Event): void {
      const color = (event.target as HTMLFormElement).value
      return this.changeColor(color)
    },
    updateSizeX (event: Event): void {
      const value = parseInt((event.target as HTMLFormElement).value)
      return this.changeSize({ axis: 'x', value })
    },
    updateSizeY (event: Event): void {
      const value = parseInt((event.target as HTMLFormElement).value)
      return this.changeSize({ axis: 'y', value })
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

#background-color {
  height: 30px;
  border: 0;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
}

select {
  padding: 5px;
  font-size: 1rem;
  border: 2px solid #00003f;
  border-radius: 5px;
  background: #e9e9e9;
}
</style>
