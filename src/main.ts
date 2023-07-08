import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import VueKonva from 'vue-konva'

createApp(App)
  .use(store, key)
  .use(VueKonva)
  .mount('#app')
