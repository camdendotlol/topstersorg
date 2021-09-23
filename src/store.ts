import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { Chart } from './types'

export interface State {
  chart: Chart
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<State>({
  state () {
    return {
      chart: {
        title: '',
        items: [],
        size: {
          x: 5,
          y: 5
        },
        color: '#000000',
        showTitles: false
      }
    }
  },
  mutations: {
    addItem (state: State, item) {
      state.chart.items.push(item)
    },
    changeTitle (state: State, newTitle: string) {
      state.chart.title = newTitle
    },
    changeColor (state: State, newColor: string) {
      state.chart.color = newColor
    },
    changeSize (state: State, payload: { axis: string, value: number }) {
      switch (payload.axis) {
        case 'x':
          state.chart.size.x = payload.value
          break
        case 'y':
          state.chart.size.y = payload.value
          break
        default:
          state.chart.size = { ...state.chart.size }
      }
    },
    toggleTitles (state: State, showTitles: boolean) {
      state.chart.showTitles = showTitles
    }
  }
})

export const useStore = (): Store<State> => {
  return baseUseStore(key)
}
