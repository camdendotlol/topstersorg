import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()
enableDragDropTouch()

createApp(App)
  .use(pinia)
  .mount('#app')
