<template>
  <div id="chart-options">
    <h2>Options</h2>
    <div class="form-option">
      <label for="display-titles">Display Titles</label>
      <input
        type="checkbox"
        name="display-titles"
        id="display-titles"
        @change="changeShowTitles"
      >
      <label for="chart-size">Size</label>
      <input
        min=1
        max=10
        value=5
        type="number"
        name="x-axis"
        id="x-axis"
        class="dimension-input"
        @change="updateSizeX"
      >
      <input
        min=1
        max=10
        value=5
        type="number"
        name="y-axis"
        id="y-axis"
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
    <div class="form-option">
      <label for="gap">Gap</label>
      <p class="gap-amount">
        {{ gap }}px
      </p>
      <input
        type="range"
        min="0"
        max="150"
        value="0"
        name="gap"
        id="gap"
        @input="updateGap"
      >
    </div>
    <div class="form-option">
      <button
        id="reset"
        @click="resetState"
      >
        Reset (temporary dev option)
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getStoredCharts } from '@/helpers/localStorage'
import { initialState } from '@/store'
import { Chart } from '@/types'
import { defineComponent } from '@vue/runtime-core'
import { mapMutations } from 'vuex'

export default defineComponent({
  data () {
    return {
      gap: 0
    }
  },
  mounted () {
    this.setupFromLocalstorage()
  },
  methods: {
    ...mapMutations([
      'changeTitle',
      'changeColor',
      'changeSize',
      'changeGap',
      'toggleTitles',
      'reset'
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
    },
    updateGap (event: Event): void {
      const value = parseInt((event.target as HTMLFormElement).value)
      this.gap = value
      return this.changeGap(value)
    },
    changeShowTitles (event: Event): void {
      const value: boolean = (event.target as HTMLFormElement).checked
      return this.toggleTitles(value)
    },
    resetState (): void {
      this.populateForm(initialState.chart)
      return this.reset()
    },
    setupFromLocalstorage (): void {
      const savedCharts = getStoredCharts()

      let activeChart

      if (savedCharts.length > 0) {
        activeChart = savedCharts.find(chart => chart.currentlyActive)
      }

      if (activeChart) {
        this.populateForm(activeChart.data)
      }
    },
    populateForm (chart: Chart): void {
      (document.getElementById('display-titles') as HTMLFormElement).checked = chart.showTitles;

      (document.getElementById('x-axis') as HTMLFormElement).value = chart.size.x;
      (document.getElementById('y-axis') as HTMLFormElement).value = chart.size.y;

      (document.getElementById('title') as HTMLFormElement).value = chart.title;

      (document.getElementById('background-color') as HTMLFormElement).value = chart.color;

      (document.getElementById('gap') as HTMLFormElement).value = chart.gap
      this.gap = chart.gap
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

.gap-amount {
  margin: 0;
}
</style>
