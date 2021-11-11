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

<script lang="ts">
import { downloadChart } from '@/helpers/chart'
import { State } from '@/store'
import { defineComponent } from '@vue/runtime-core'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'
import { mapState } from 'vuex'

export default defineComponent({
  components: {
    BIconFileEarmarkArrowDown,
    BIconArrowRepeat
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async saveChart () {
      this.loading = true

      await downloadChart(this.chart)

      this.loading = false
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
