<template>
  <div id="top-bar">
    <button
      v-if="!loading"
      id="save-button"
      @click="saveChart"
    >
      <BIconFileEarmarkArrowDown id="save-icon" />
      Download chart
    </button>
    <button
      v-else
      id="save-button"
    >
      <BIconArrowRepeat id="loading-icon" />
      loading...
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import getChart from '../../api/chartGen'
import { State } from '../../store'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'

export default defineComponent({
  components: {
    BIconFileEarmarkArrowDown,
    BIconArrowRepeat
  },
  data () {
    return {
      // Keep track of loading so the user knows why it's taking a while.
      // Also, we can prevent the user from spamming the button to generate multiple requests.
      loading: false
    }
  },
  methods: {
    async saveChart () {
      this.loading = true

      const chart = await getChart(this.chart)
      const url = window.URL.createObjectURL(chart)

      // If on a mobile browser, use the native share functionality.
      // Otherwise, use the normal download trick.
      if (navigator.canShare) {
        const files = [
          new File(
            [chart],
            'chart.jpg',
            {
              type: 'image/jpeg',
              lastModified: new Date().getTime()
            }
          )
        ]

        await navigator.share({
          files,
          title: 'Chart',
          text: 'My topster chart from ostrakon.xyz'
        })
      } else {
        const a = document.createElement('a')

        a.style.display = 'none'
        a.href = url
        a.download = 'chart.jpg'

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        window.URL.revokeObjectURL(url)
      }

      this.loading = false
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

#loading-icon {
  position: relative;
  top: 2px;
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

@media screen and (max-width: 1000px) {
  #top-bar {
    width: 100%;
  }
}
</style>