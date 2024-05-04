import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import { createHead } from '@unhead/vue'

const head = createHead()

createApp(App)
  .use(store, key)
  .use(head)
  .mount('#app')
