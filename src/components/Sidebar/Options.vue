<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useStore } from '../../store'
import { BackgroundTypes } from '../../types'
import type { Chart, TitlePosition } from '../../types'

const store = useStore()

const gap: Ref<number> = ref(0)
const backgroundType: Ref<BackgroundTypes> = ref(BackgroundTypes.Image)

const chart: Ref<Chart> = ref(store.chart)

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
const titlePositionRef: Ref<HTMLFormElement> = ref(null)

watch(() => store.chart, () => {
  chart.value = store.chart
  backgroundType.value = chart.value.background.type
  populateForm(chart.value)
})

onMounted(() => {
  backgroundType.value = chart.value.background.type
  initalSetup()
})

function updateTitle(event: Event): void {
  const title = (event.target as HTMLFormElement).value
  return store.changeTitle(title)
}

function updateBackgroundColor(event: Event): void {
  const color = (event.target as HTMLFormElement).value
  return store.changeBackgroundColor(color)
}

function updateSizeX(event: Event): void {
  const value = Number.parseInt((event.target as HTMLFormElement).value)
  return store.changeSize({ axis: 'x', value })
}

function updateSizeY(event: Event): void {
  const value = Number.parseInt((event.target as HTMLFormElement).value)
  return store.changeSize({ axis: 'y', value })
}

function updateGap(event: Event): void {
  const value = Number.parseInt((event.target as HTMLFormElement).value)
  gap.value = value
  return store.changeGap(value)
}

function changeShowNumbers(event: Event): void {
  const value = (event.target as HTMLFormElement).checked
  return store.toggleNumbers(value)
}

function changeShowShadows(event: Event): void {
  const value = (event.target as HTMLFormElement).checked
  return store.toggleShadows(value)
}

function updateFont(event: Event): void {
  const value = (event.target as HTMLFormElement).value
  return store.changeFont(value)
}

function updateTextColor(event: Event): void {
  const value = (event.target as HTMLFormElement).value
  return store.changeTextColor(value)
}

function changeShowTitles(event: Event): void {
  const value: boolean = (event.target as HTMLFormElement).checked
  return store.toggleTitles(value)
}

function changeTitlePosition(event: Event): void {
  const value: TitlePosition = (event.target as HTMLFormElement).value
  return store.setTitlePosition(value)
}

function initalSetup(): void {
  if (store.chart) {
    populateForm(store.chart)
  }
}

function populateForm(chart: Chart): void {
  displayTitlesRef.value.checked = chart.showTitles

  xAxisRef.value.value = chart.size.x
  yAxisRef.value.value = chart.size.y

  titleRef.value.value = chart.title

  backgroundTypeInputRef.value.value = chart.background.type

  if (chart.background.type === BackgroundTypes.Color) {
    backgroundColorInputRef.value.value = chart.background.value
  }
  else if (chart.background.type === BackgroundTypes.Image) {
    backgroundImageInputRef.value.value = chart.background.value
  }

  gapRef.value.value = chart.gap

  textColorRef.value.value = chart.textColor

  showNumbersRef.value.checked = chart.showNumbers
  showShadowsRef.value.checked = chart.shadows

  fontRef.value.value = chart.font

  gap.value = chart.gap

  titlePositionRef.value.value = chart.titlePosition
}

function changeBackgroundType(event: Event): void {
  const newType = ((event.target as HTMLFormElement).value)
  if (newType === BackgroundTypes.Color || newType === BackgroundTypes.Image) {
    backgroundType.value = newType
  }
}

function updateBackgroundImage(event: Event): void {
  const url = ((event.target as HTMLFormElement).value)
  store.setBackgroundImage(url)
}
</script>

<template>
  <table class="options-table">
    <tbody>
      <tr>
        <td>
          <label for="title">Title</label>
        </td>
        <td>
          <input
            id="title"
            ref="titleRef"
            type="text"
            name="title"
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
            id="display-titles"
            ref="displayTitlesRef"
            type="checkbox"
            name="display-titles"
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
            id="x-axis"
            ref="xAxisRef"
            min="1"
            max="12"
            value="5"
            type="range"
            name="x-axis"
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
            id="y-axis"
            ref="yAxisRef"
            min="1"
            max="12"
            value="5"
            type="range"
            name="y-axis"
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
            id="background-type"
            ref="backgroundTypeInputRef"
            name="background-type"
            @change="changeBackgroundType"
          >
            <option value="color">
              Color
            </option>
            <option value="image">
              Image
            </option>
          </select>
        </td>
      </tr>
      <tr :class="backgroundType === 'color' ? '' : 'hidden'">
        <td>
          <label for="background-color">Background color</label>
        </td>
        <td>
          <input
            id="background-color"
            ref="backgroundColorInputRef"
            type="color"
            name="background-color"
            class="color-picker"
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
            id="background-image"
            ref="backgroundImageInputRef"
            type="text"
            name="background-image"
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
            id="gap"
            ref="gapRef"
            type="range"
            min="0"
            max="150"
            value="0"
            name="gap"
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
            id="show-numbers"
            ref="showNumbersRef"
            type="checkbox"
            name="show-numbers"
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
            id="show-shadows"
            ref="showShadowsRef"
            type="checkbox"
            name="show-shadows"
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
            id="font"
            ref="fontRef"
            type="text"
            name="font"
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
            id="text-color"
            ref="textColorRef"
            type="color"
            name="text-color"
            class="color-picker"
            @change="updateTextColor"
          >
        </td>
      </tr>
      <tr>
        <td>
          <label for="title-position">Title position</label>
        </td>
        <td>
          <select
            id="title-position"
            ref="titlePositionRef"
            name="title-position"
            @change="changeTitlePosition"
            @value="chart.titlePosition"
          >
            <option value="right">
              Right
            </option>
            <option value="below">
              Below
            </option>
          </select>
        </td>
      </tr>
    </tbody>
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
