<template>
  <Home />
  <AnnouncementModal
    v-if="this.displayAnnouncement"
    @toggleAnnouncement="toggleAnnouncement"
  />
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
import Home from './Home.vue'
import AnnouncementModal from './components/AnnouncementModal.vue'
import { ping } from './api/metadata'
import { redirectUsers } from './helpers/redirect'

export default defineComponent({
  data: () => ({
    displayAnnouncement: false
  }),
  components: {
    Home,
    AnnouncementModal
  },
  methods: {
    toggleAnnouncement () {
      this.displayAnnouncement = !this.displayAnnouncement
      localStorage.setItem('seenAnnouncement', 'true')
    }
  },
  async mounted () {
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
      this.displayAnnouncement = true
    }

    await ping()
  }
})
</script>

<style>

</style>
