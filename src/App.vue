<script setup lang="ts">
import { onMounted } from 'vue'
import Home from './Home.vue'
import { redirectUsers } from './helpers/redirect'
import './global.css'

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
