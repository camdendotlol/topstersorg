import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import { Chart } from './types'

interface State {
  chart: Chart
}

const store = createStore<State>({
  state () {
    return {
      chart: {
        title: '',
        items: [],
        size: {
          x: 3,
          y: 3
        }
      }
    }
  },
  mutations: {
    addItem (state: State, item) {
      state.chart.items.push(item)
    }
  }
})

const app = createApp(App)
app.use(store)
app.mount('#app')
