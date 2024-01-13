<script setup lang="ts">
import { onMounted } from 'vue'
import Home from './Home.vue'
import AnnouncementModal from './components/AnnouncementModal.vue'
import { ping } from './api/metadata'
import { redirectUsers } from './helpers/redirect'
import './global.css'
import { localStorageMigrations } from './helpers/localStorage'

let displayAnnouncement = false

const toggleAnnouncement = () => {
  displayAnnouncement = !displayAnnouncement
  localStorage.setItem('seenAnnouncement', 'true')
}

onMounted(async () => {
  // Redirect new users to topsters.org
  if (window.location.href.includes('ostrakon.xyz')) {
    redirectUsers()
  }

  // Display redirect notice
  if (
    document.referrer.includes('ostrakon.xyz') &&
    window.location.href.includes('topsters.org') &&
    !localStorage.getItem('seenAnnouncement')
  ) {
    displayAnnouncement = true
  }

  localStorageMigrations()

  await ping()
})
</script>

<template>
  <Home />
  <AnnouncementModal
    v-if="displayAnnouncement"
    @toggleAnnouncement="toggleAnnouncement"
  />
</template>
