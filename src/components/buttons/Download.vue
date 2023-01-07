<script setup lang="ts">
import { downloadChart } from '../../helpers/chart'
import { ref } from 'vue'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'
import { useStore } from '../../store'

const loading = ref(false)

const store = useStore()

const saveChart = async () => {
  loading.value = true

  await downloadChart(store.state.chart)

  loading.value = false
}

</script>

<template>
  <button
    type="button"
    class="toggle-button"
    id="home-button"
  >
    <BIconFileEarmarkArrowDown
      v-if="!loading"
      @click="saveChart"
    />
    <BIconArrowRepeat
      v-else
      id="loading-icon"
    />
  </button>
</template>

<style scoped>
#loading-icon {
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

svg {
  height: 15px;
  width: 15px;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
