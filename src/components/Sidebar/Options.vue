<script setup lang="ts">
import { useStore } from '../../store'
import { BackgroundTypes, Chart } from '../../types'
import { onMounted, ref, Ref } from 'vue'

const store = useStore()

const gap: Ref<number> = ref(0)
const backgroundType: Ref<BackgroundTypes> = ref(BackgroundTypes.Image)

const chart: Ref<Chart> = ref(store.state.chart)

// Buckle up, here come the element refs 🤠
const displayTitlesRef: Ref<HTMLFormElement> = ref(null)
const xAxisRef: Ref<HTMLFormElement> = ref(null)
const yAxisRef: Ref<HTMLFormElement> = ref(null)
const titleRef: Ref<HTMLFormElement> = ref(null)
const backgroundTypeInputRef: Ref<HTMLFormElement> = ref(null)
const backgroundColorInputRef: Ref<HTMLFormElement> = ref(null)
const backgroundImageInputRef: Ref<HTMLFormElement> = ref(null)
const gapRef: Ref<HTMLFormElement> = ref(null)
const textColorRef: Ref<HTMLFormElement> = ref(null)
const showNumbersRef: Ref<HTMLFormElement> = ref(null)
const showShadowsRef: Ref<HTMLFormElement> = ref(null)
const fontRef: Ref<HTMLFormElement> = ref(null)

store.watch(state => state.chart, () => {
  chart.value = store.state.chart
  backgroundType.value = chart.value.background.type
  populateForm(chart.value)
})

onMounted(() => {
  backgroundType.value = chart.value.background.type
  initalSetup()
})

const updateTitle = (event: Event): void => {
  const title = (event.target as HTMLFormElement).value
  return store.commit('changeTitle', title)
}

const updateBackgroundColor = (event: Event): void => {
  const color = (event.target as HTMLFormElement).value
  return store.commit('changeBackgroundColor', color)
}

const updateSizeX = (event: Event): void => {
  const value = parseInt((event.target as HTMLFormElement).value)
  return store.commit('changeSize', { axis: 'x', value })
}

const updateSizeY = (event: Event): void => {
  const value = parseInt((event.target as HTMLFormElement).value)
  return store.commit('changeSize', { axis: 'y', value })
}

const updateGap = (event: Event): void => {
  const value = parseInt((event.target as HTMLFormElement).value)
  gap.value = value
  return store.commit('changeGap', value)
}

const changeShowNumbers = (event: Event): void => {
  const value = (event.target as HTMLFormElement).checked
  return store.commit('toggleNumbers', value)
}

const changeShowShadows = (event: Event): void => {
  const value = (event.target as HTMLFormElement).checked
  return store.commit('toggleShadows', value)
}

const updateFont = (event: Event): void => {
  const value = (event.target as HTMLFormElement).value
  return store.commit('changeFont', value)
}

const updateTextColor = (event: Event): void => {
  const value = (event.target as HTMLFormElement).value
  return store.commit('changeTextColor', value)
}

const changeShowTitles = (event: Event): void => {
  const value: boolean = (event.target as HTMLFormElement).checked
  return store.commit('toggleTitles', value)
}

const initalSetup = (): void => {
  if (store.state.chart) {
    populateForm(store.state.chart)
  }
}

const populateForm = (chart: Chart): void => {
  displayTitlesRef.value.checked = chart.showTitles

  xAxisRef.value.value = chart.size.x
  yAxisRef.value.value = chart.size.y

  titleRef.value.value = chart.title

  backgroundTypeInputRef.value.value = chart.background.type

  if (chart.background.type === BackgroundTypes.Color) {
    backgroundColorInputRef.value.value = chart.background.value
  } else if (chart.background.type === BackgroundTypes.Image) {
    backgroundImageInputRef.value.value = chart.background.value
  }

  gapRef.value.value = chart.gap

  textColorRef.value.value = chart.textColor

  showNumbersRef.value.checked = chart.showNumbers
  showShadowsRef.value.checked = chart.shadows

  fontRef.value.value = chart.font

  gap.value = chart.gap
}

const changeBackgroundType = (event: Event): void => {
  const newType = ((event.target as HTMLFormElement).value)
  if (newType === BackgroundTypes.Color || newType === BackgroundTypes.Image) {
    backgroundType.value = newType
  }
}

const updateBackgroundImage = (event: Event): void => {
  const url = ((event.target as HTMLFormElement).value)
  store.commit('setBackgroundImage', url)
}
</script>

<template>
  <table class="options-table">
    <tr>
      <td>
        <label for="title">Title</label>
      </td>
      <td>
        <input
          type="text"
          name="title"
          id="title"
          ref="titleRef"
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
          ref="displayTitlesRef"
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
          ref="xAxisRef"
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
          ref="yAxisRef"
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
          ref="backgroundTypeInputRef"
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
          class="color-picker"
          ref="backgroundColorInputRef"
          @change="updateBackgroundColor"
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
          ref="backgroundImageInputRef"
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
          ref="gapRef"
          id="gap"
          @input="updateGap"
        >
      </td>
    </tr>
    <tr>
      <td>
        <label for="show-numbers">Show Numbers</label>
      </td>
      <td>
        <input
          type="checkbox"
          name="show-numbers"
          ref="showNumbersRef"
          id="show-numbers"
          @change="changeShowNumbers"
        >
      </td>
    </tr>
    <tr>
      <td>
        <label for="show-shadows">Show Shadows</label>
      </td>
      <td>
        <input
          type="checkbox"
          name="show-shadows"
          ref="showShadowsRef"
          id="show-shadows"
          @change="changeShowShadows"
        >
      </td>
    </tr>
    <tr>
      <td>
        <label for="font">Font</label>
      </td>
      <td class="cell-with-value">
        <input
          type="text"
          name="font"
          ref="fontRef"
          id="font"
          @input="updateFont"
        >
      </td>
    </tr>
    <tr>
      <td>
        <label for="text-color">Text color</label>
      </td>
      <td>
        <input
          type="color"
          name="text-color"
          id="text-color"
          class="color-picker"
          ref="textColorRef"
          @change="updateTextColor"
        >
      </td>
    </tr>
  </table>
</template>

<style scoped>
.hidden {
  display: none;
}

.color-picker {
  height: 30px;
  width: 30px;
  border: none;
  padding: 0;
  overflow: hidden;
}

.cell-with-value {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell-with-value span {
  width: 30px;
}

input {
  width: 100%;
}

#background-type {
  color: black;
}

table {
  width: 100%;
}

tr {
  display: grid;
  grid-template-columns: 120px 1fr;
  margin: 10px 0;
  width: 100%;
}

td {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>
