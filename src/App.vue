<script setup lang="ts">
import { onMounted } from 'vue'
import Home from './Home.vue'
import { redirectUsers } from './helpers/redirect'
import { useHead } from '@unhead/vue'
import './global.css'

useHead({
  script: [
    {
      innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${import.meta.env.VITE_GOOGLE_ANALYTICS_TAG}');`
    },
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_TAG}`
    }
  ]
})

onMounted(async () => {
  // Redirect new users to topsters.org
  if (window.location.href.includes('ostrakon.xyz')) {
    redirectUsers()
  }
})
</script>

<template>
  <Home />
</template>
