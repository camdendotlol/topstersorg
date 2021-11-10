<template>
  <div id="chart-options">
    <div class="content">
      <table>
        <tr>
          <td>
            <label for="title">Title</label>
          </td>
          <td>
            <input
              type="text"
              name="title"
              id="title"
              @input="updateTitle"
            >
          </td>
        </tr>
        <tr>
          <td>
            <label for="display-titles">Display Titles</label>
          </td>
          <td>
            <input
              type="checkbox"
              name="display-titles"
              id="display-titles"
              @change="changeShowTitles"
            >
          </td>
        </tr>
        <tr>
          <td>
            <label for="chart-size">Width</label>
          </td>
          <td class="cell-with-value">
            <span>{{ chart.size.x }}</span>
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
          </td>
        </tr>
        <tr class="axis-row">
          <td>
            <label for="y-axis">Height</label>
          </td>
          <td class="cell-with-value">
            <span>{{ chart.size.y }}</span>
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
          </td>
        </tr>
        <tr>
          <td>
            <label for="background-type">Background type</label>
          </td>
          <td>
            <select
              name="background-type"
              id="background-type"
              @change="changeBackgroundType"
            >
              <option value="color">Color</option>
              <option value="image">Image</option>
            </select>
          </td>
        </tr>
        <tr :class="backgroundType === 'color' ? '' : 'hidden'">
          <td>
            <label for="background-color">Background color</label>
          </td>
          <td>
            <input
              type="color"
              name="background-color"
              id="background-color"
              @change="updateColor"
            >
          </td>
        </tr>
        <tr :class="backgroundType === 'image' ? '' : 'hidden'">
          <td>
            <label for="background-image">Background image</label>
          </td>
          <td>
            <input
              type="text"
              name="background-image"
              id="background-image"
              @change="updateBackgroundImage"
            >
          </td>
        </tr>
        <tr>
          <td>
            <label for="gap">Gap</label>
          </td>
          <td class="cell-with-value">
            <span>{{ gap }}</span>
            <input
              type="range"
              min="0"
              max="150"
              value="0"
              name="gap"
              id="gap"
              @input="updateGap"
            >
          </td>
        </tr>
      </table>
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
#chart-options {
  display: flex;
  background: #72bcd4;
  border-radius: 0 0 5px 5px;
}

.content {
  margin: 10px auto;
}

#background-color {
  height: 30px;
  border: 0;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
}

#x-axis, #y-axis {
  width: 100px;
}

.cell-with-value {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell-with-value span {
  width: 30px;
}

select {
  padding: 5px;
  font-size: 1rem;
  border-radius: 5px;
  background: #e9e9e9;
}

input {
  width: 140px;
  padding: 8px;
}

.gap-amount {
  margin: 0;
}

td {
  padding-bottom: 10px;
}

.hidden {
  display: none;
}
</style>
