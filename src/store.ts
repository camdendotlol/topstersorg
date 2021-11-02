import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { BackgroundTypes, Chart, ChartItem } from './types'

export interface State {
  chart: Chart
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

export const initialState = {
  chart: {
    title: '',
    items: Array(144).fill(null),
    size: {
      x: 5,
      y: 5
    },
    background: {
      type: BackgroundTypes.Color,
      value: '#000000'
    },
    showTitles: false,
    gap: 20
  }
}

export const store = createStore<State>({
  state () {
    return { ...initialState }
  },
  mutations: {
    // For overriding the existing item (e.g. adding to a null slot, or removing an item)
    addItem (state: State, payload: { item: ChartItem | null, index: number }) {
      const itemsArray = state.chart.items
      itemsArray[payload.index] = payload.item
      state.chart = { ...state.chart, items: [...itemsArray] }
    },
    // For changing the place of a current item
    insertItem (state: State, payload: { item: ChartItem, oldIndex: number, newIndex: number }) {
      const itemsArray = [...state.chart.items]

      // Remove the item from its old index
      itemsArray.splice(payload.oldIndex, 1)

      // Add the item at its new index
      itemsArray.splice(payload.newIndex, 0, payload.item)

      state.chart = { ...state.chart, items: [...itemsArray] }
    },
    changeTitle (state: State, newTitle: string) {
      state.chart = { ...state.chart, title: newTitle }
    },
    changeColor (state: State, newColor: string) {
      state.chart = {
        ...state.chart,
        background: {
          type: BackgroundTypes.Color,
          value: newColor
        }
      }
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
