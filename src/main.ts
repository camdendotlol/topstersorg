import { createApp } from 'vue'
import App from './App.vue'
import { key, store } from './store'

createApp(App)
  .use(store, key)
  .mount('#app')
