import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import { store, key } from './store'

const app = createApp(App)
app.use(VueKonva)
app.use(store, key)
app.mount('#app')
