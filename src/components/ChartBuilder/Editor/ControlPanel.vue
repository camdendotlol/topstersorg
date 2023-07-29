<script setup lang="ts">
import { reactive } from 'vue'
import { store } from '../../../store'

const props = defineProps(['marginLeft'])

const controlPanelConfig = {
  x: props.marginLeft,
  y: 0,
  height: 60,
  width: 400,
  fill: 'black',
  cornerRadius: [0, 0, 5, 5],
  horizontalAlign: 'middle',
  shadowColor: 'black',
  shadowBlur: 10,
  shadowOpacity: 0.5
}

console.log(store.state.chart)

store.watch(state => state.chart.title, () => {
  chartTitleConfig.text = store.state.chart.title
})

const chartTitleConfig = reactive({
  x: 20,
  y: 100,
  text: '',
  fontSize: 20,
  fontFamily: 'Helvetica',
  fill: 'white',
  padding: 0,
  align: 'center'
})

</script>

<template>
  <v-layer :key="chartTitleConfig.text">
    <v-rect :config="controlPanelConfig">
      <v-text :config="chartTitleConfig">
      </v-text>
    </v-rect>
  </v-layer>
</template>

<style scoped>
</style>
