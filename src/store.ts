import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { Chart, ChartItem } from './types'

export interface State {
  chart: Chart
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

export const initialState = {
  chart: {
    title: '',
    items: Array(100).fill(null),
    size: {
      x: 5,
      y: 5
    },
    color: '#000000',
    showTitles: false,
    gap: 20
  }
}

export const store = createStore<State>({
  state () {
    return { ...initialState }
  },
  mutations: {
    addItem (state: State, payload: { item: ChartItem, index: number }) {
      const itemsArray = state.chart.items
      itemsArray[payload.index] = payload.item
      state.chart = { ...state.chart, items: [...itemsArray] }
    },
    changeTitle (state: State, newTitle: string) {
      state.chart = { ...state.chart, title: newTitle }
    },
    changeColor (state: State, newColor: string) {
      state.chart = { ...state.chart, color: newColor }
    },
    changeSize (state: State, payload: { axis: string, value: number }) {
      switch (payload.axis) {
        case 'x':
          state.chart = { ...state.chart, size: { y: state.chart.size.y, x: payload.value } }
          break
        case 'y':
          state.chart = { ...state.chart, size: { x: state.chart.size.x, y: payload.value } }
          break
        default:
          state.chart = { ...state.chart }
      }
    },
    changeGap (state: State, newGap: number) {
      state.chart = { ...state.chart, gap: newGap }
    },
    toggleTitles (state: State, newValue: boolean) {
      state.chart = { ...state.chart, showTitles: newValue }
    },
    setEntireChart (state: State, payload: Chart) {
      state.chart = payload
    },
    reset (state: State) {
      state.chart = { ...initialState.chart }
    }
  }
})

export const useStore = (): Store<State> => {
  return baseUseStore(key)
}
