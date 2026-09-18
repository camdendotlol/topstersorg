<script setup lang="ts">
import type { LayoutPreset } from '../../../types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { layoutPresets } from '../../../helpers/layout'
import { useStore } from '../../../store'
import { BackgroundTypes, LayoutTypes, TitlePositions } from '../../../types'
import ColorInput from './ColorInput.vue'
import RangeInput from './RangeInput.vue'
import SelectInput from './SelectInput.vue'
import TextInput from './TextInput.vue'
import ToggleInput from './ToggleInput.vue'

const store = useStore()
const storeRef = storeToRefs(store)

const layoutType = computed(() => storeRef.chart.value.tiers ? LayoutTypes.Tiered : LayoutTypes.Grid)

function isSelectedPreset(preset: LayoutPreset) {
  return JSON.stringify(preset.tiers) === JSON.stringify(storeRef.chart.value.tiers)
}
</script>

<template>
  <div class="options-list">
    <div class="separator" aria-hidden />
    <TextInput
      label="Title"
      property="title"
      @handle-change="store.changeTitle"
    />
    <div class="separator" aria-hidden />
    <ToggleInput
      label="Show Titles"
      property="showTitles"
      @handle-change="store.toggleTitles"
    />
    <div class="separator" aria-hidden />
    <template v-if="storeRef.chart.value.showTitles">
      <SelectInput
        label="Title Position"
        property="titlePosition"
        :options="Object.values(TitlePositions)"
        :value="storeRef.chart.value.titlePosition ?? TitlePositions.Side"
        @handle-change="store.setTitlePosition"
      />
      <div class="separator" aria-hidden />
    </template>
    <SelectInput
      label="Layout"
      property="layoutType"
      :options="Object.values(LayoutTypes)"
      :value="layoutType"
      @handle-change="store.setLayoutType"
    />
    <div class="separator" aria-hidden />
    <template v-if="layoutType === LayoutTypes.Grid">
      <RangeInput
        label="Width"
        property="chartWidth"
        :min="1"
        :max="12"
        :value="storeRef.chart.value.size.x"
        :data-list-step-interval="1"
        @handle-change="store.setWidth"
      />
      <div class="separator" aria-hidden />
      <RangeInput
        label="Height"
        property="chartHeight"
        :min="1"
        :max="12"
        :value="storeRef.chart.value.size.y"
        :data-list-step-interval="1"
        @handle-change="store.setHeight"
      />
      <div class="separator" aria-hidden />
    </template>
    <template v-if="layoutType === LayoutTypes.Tiered">
      <div class="layout-settings">
        <button
          v-for="preset in layoutPresets"
          :key="preset.name"
          type="button"
          :class="{ 'selected-layout': isSelectedPreset(preset) }"
          @click="store.setTiers(preset.tiers)"
        >
          {{ preset.name }}
        </button>
      </div>
      <div class="separator" aria-hidden />
    </template>
    <SelectInput
      label="Background Type"
      property="backgroundType"
      :options="Object.values(BackgroundTypes)"
      :value="storeRef.chart.value.backgroundType"
      @handle-change="store.setBackgroundType"
    />
    <div class="separator" aria-hidden />
    <template v-if="storeRef.chart.value.backgroundType === BackgroundTypes.Color">
      <ColorInput
        label="Background Color"
        property="backgroundColor"
        @handle-change="store.setBackgroundColor"
      />
      <div class="separator" aria-hidden />
    </template>
    <template v-if="storeRef.chart.value.backgroundType === BackgroundTypes.Image">
      <TextInput
        label="Background URL"
        property="backgroundUrl"
        @handle-change="store.setBackgroundUrl"
      />
      <div class="separator" aria-hidden />
    </template>
    <RangeInput
      label="Gap"
      property="gap"
      :max="150"
      :min="0"
      @handle-change="store.changeGap"
    />
    <div class="separator" aria-hidden />
    <ToggleInput
      label="Show Numbers"
      property="showNumbers"
      @handle-change="store.toggleNumbers"
    />
    <div class="separator" aria-hidden />
    <ToggleInput
      label="Show Shadows"
      property="shadows"
      @handle-change="store.toggleShadows"
    />
    <div class="separator" aria-hidden />
    <ToggleInput
      label="Round Corners"
      property="roundCorners"
      @handle-change="store.toggleRoundedCorners"
    />
    <div class="separator" aria-hidden />
    <TextInput
      label="Font"
      property="font"
      @handle-change="store.changeFont"
    />
    <div class="separator" aria-hidden />
    <ColorInput
      label="Text Color"
      property="textColor"
      :value="storeRef.chart.value.textColor"
      @handle-change="store.changeTextColor"
    />
  </div>
</template>

<style scoped>
.options-list {
  display: flex;
  flex-flow: column;
  gap: 10px;
}

.layout-settings {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 4px;
}

.layout-settings button {
  height: 48px;
  background: #393939;
  border: none;
  font-size: 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  gap: 6px;
  color: white;
}

.layout-settings .selected-layout {
  color: var(--accent);
  text-decoration: underline;
}

.layout-settings button:hover {
  cursor: pointer;
}

.layout-settings label {
  display: block;
}

.layout-settings button svg {
  height: 24px;
  width: 24px;
}

.separator {
  border-top: 1px solid rgba(60, 60, 60, 0.9);
  margin: 4px 0;
}
</style>
