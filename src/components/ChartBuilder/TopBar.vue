<template>
  <div id="top-bar">
    <button
      id="save-button"
      @click="saveChart"
    >
      <BIconFileEarmarkArrowDown id="save-icon" />
      Download chart
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import getChart from '../../api/chartGen'
import { State } from '../../store'
import { BIconFileEarmarkArrowDown } from 'bootstrap-icons-vue'

export default defineComponent({
  components: {
    BIconFileEarmarkArrowDown
  },
  methods: {
    async saveChart () {
      const chart = await getChart(this.chart)
      const url = window.URL.createObjectURL(chart)
      const a = document.createElement('a')

      a.style.display = 'none'
      a.href = url
      a.download = 'chart.jpg'

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      window.URL.revokeObjectURL(url)
    }
  },
  computed: mapState({
    chart: state => (state as State).chart
  })
})
</script>

<style>
#top-bar {
  width: calc(100vw - 400px);
  height: 40px;
  background: #00003f;
  position: relative;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row-reverse;
  gap: 50px;
  color: white;
  box-shadow: 0 1px 2px #00003f;
}

#save-button {
  font-family: "Ubuntu Mono", monospace;
  height: 30px;
  align-self: center;
  margin-right: 20px;
}

#save-icon {
  position: relative;
  top: 2px;
}

@media screen and (max-width: 1000px) {
  #top-bar {
    width: 100%;
  }
}
</style>
