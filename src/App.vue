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
    }
  },
  async mounted () {
    if (
      document.referrer.includes('ostrakon.xyz') &&
      window.location.href.includes('topsters.org')
    ) {
      this.displayAnnouncement = true
    }

    await ping()
  }
})
</script>

<style>

</style>
