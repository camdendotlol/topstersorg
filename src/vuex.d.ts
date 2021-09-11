import { Store } from 'vuex'
import { Chart } from './types'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    chart: Chart
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
