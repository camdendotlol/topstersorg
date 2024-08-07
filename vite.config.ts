import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePluginRadar({
    analytics: {
      id: 'G-4GL8BY0YV1'
    }
  })]
})
