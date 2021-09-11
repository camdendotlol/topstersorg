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

export const useStore = (): Store<State> => {
  return baseUseStore(key)
}