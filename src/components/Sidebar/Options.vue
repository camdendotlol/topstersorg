<template>
  <div id="chart-options">
    <div class="content">
      <div class="form-option">
        <label for="display-titles">Display Titles</label>
        <input
          type="checkbox"
          name="display-titles"
          id="display-titles"
          @change="changeShowTitles"
        >
        <label for="chart-size">Size</label>
        <div class="axis-item">
          <label for="x-axis">x: {{ chart.size.x }}</label>
          <input
            min=1
            max=12
            value=5
            type="range"
            name="x-axis"
            id="x-axis"
            class="dimension-input"
            @input="updateSizeX"
          >
        </div>
        <div class="axis-item">
          <label for="y-axis">y: {{ chart.size.y }}</label>
          <input
            min=1
            max=12
            value=5
            type="range"
            name="y-axis"
            id="y-axis"
            class="dimension-input"
            @input="updateSizeY"
          >
        </div>
      </div>
      <div class="form-option">
        <label for="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          @input="updateTitle"
        >
      </div>
      <div class="form-option">
        <label for="background-type">Background type</label>
        <select
          name="background-type"
          id="background-type"
          @change="changeBackgroundType"
        >
          <option value="color">Color</option>
          <option value="image">Image</option>
        </select>
      </div>
      <div class="form-option">
        <div :class="backgroundType === 'color' ? '' : 'hidden'">
          <label for="background-color">Background color</label>
          <input
            type="color"
            name="background-color"
            id="background-color"
            @change="updateColor"
          >
        </div>
        <div :class="backgroundType === 'image' ? '' : 'hidden'">
          <label for="background-image">Background image</label>
          <input
            type="text"
            name="background-image"
            id="background-image"
            @change="updateBackgroundImage"
          >
        </div>
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
    </div>
  </div>
</template>

<script lang="ts">
import { getStoredCharts } from '@/helpers/localStorage'
import { State } from '@/store'
import { BackgroundTypes, Chart } from '@/types'
import { defineComponent } from '@vue/runtime-core'
import { mapMutations, mapState } from 'vuex'

export default defineComponent({
  data () {
    return {
      gap: 0,
      backgroundType: BackgroundTypes.Image
    }
  },
  mounted () {
    this.backgroundType = this.chart.background.type
    this.setupFromLocalstorage()
  },
  methods: {
    ...mapMutations([
      'changeTitle',
      'changeColor',
      'setBackgroundImage',
      'changeSize',
      'changeGap',
      'toggleTitles'
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

      (document.getElementById('background-type') as HTMLFormElement).value = chart.background.type

      if (chart.background.type === BackgroundTypes.Color) {
        (document.getElementById('background-color') as HTMLFormElement).value = chart.background.value
      } else if (chart.background.type === BackgroundTypes.Image) {
        (document.getElementById('background-image') as HTMLFormElement).value = chart.background.value
      }

      (document.getElementById('gap') as HTMLFormElement).value = chart.gap
      this.gap = chart.gap
    },
    changeBackgroundType (event: Event): void {
      const newType = ((event.target as HTMLFormElement).value)
      if (newType === BackgroundTypes.Color || newType === BackgroundTypes.Image) {
        this.backgroundType = newType
      }
    },
    updateBackgroundImage (event: Event): void {
      const url = ((event.target as HTMLFormElement).value)
      this.setBackgroundImage(url)
    }
  },
  watch: {
    chart () {
      this.backgroundType = this.chart.background.type
      this.populateForm(this.chart)
    }
  },
  computed: {
    ...mapState({
      chart: state => (state as State).chart
    })
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
  background: rgba(161, 161, 255, 0.5);
  border-radius: 0 0 5px 5px;
  margin-top: 0;
}

.content {
  margin: 10px 0 10px;
}

#background-color {
  height: 30px;
  border: 0;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
}

.axis-item {
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
}

.axis-item label {
  width: 50px;
}

#x-axis, #y-axis {
  width: 100px;
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

.hidden {
  display: none;
}
</style>
