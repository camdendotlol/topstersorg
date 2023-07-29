<script setup lang="ts">
import { Ref, ref } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import ChartBuilder from './components/ChartBuilder/index.vue'
import { BIconGearFill, BIconPlusLg, BIconHouse } from 'bootstrap-icons-vue'
import MobileOptionsSidebar from './components/MobileOptionsSidebar.vue'
import MobileSearchSidebar from './components/MobileSearchSidebar.vue'
import Popup from './components/Popup.vue'
import DownloadButton from './components/buttons/Download.vue'

const showMobileOptions: Ref<boolean> = ref(false)
const showMobileSearch: Ref<boolean> = ref(false)

const toggleMobileSearchDisplay = () => {
  showMobileOptions.value = false
  showMobileSearch.value = !showMobileSearch.value
}

const toggleMobileOptionsDisplay = () => {
  showMobileSearch.value = false
  showMobileOptions.value = !showMobileOptions.value
}

const returnToHomepage = () => {
  showMobileSearch.value = false
  showMobileOptions.value = false
}
</script>

<template>
  <div class="main">
    <div class="sidebar-div">
      <Sidebar />
    </div>
    <div>
      <button type="button" class="toggle-button" id="mobile-search-toggle" @click="toggleMobileSearchDisplay">
        <BIconPlusLg />
      </button>
      <button
        type="button"
        class="toggle-button"
        id="home-button"
        @click="returnToHomepage"
        v-if="showMobileOptions || showMobileSearch"
      >
        <BIconHouse />
      </button>
      <div
        v-if="!showMobileOptions && !showMobileSearch"
      >
        <DownloadButton />
      </div>
      <button type="button" class="toggle-button" id="mobile-options-toggle" @click="toggleMobileOptionsDisplay">
        <BIconGearFill />
      </button>
      <div class="mobile-options-visibility-manager" :class="showMobileOptions ? 'visible-mobile-options' : 'invisible-mobile-options'">
        <MobileOptionsSidebar />
      </div>
      <div class="mobile-search-visibility-manager" :class="showMobileSearch ? 'visible-mobile-search' : 'invisible-mobile-search'">
        <MobileSearchSidebar />
      </div>
      <Popup />
      <ChartBuilder />
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Ubuntu Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark-blue);
  overflow-y: hidden;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
}

body {
  background: #2a2a2a;
  box-sizing: border-box;
  touch-action: manipulation;
}

select {
  padding: 5px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid var(--dark-blue);
  background: var(--off-white);
}

.main {
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  display: grid;
  /* Why doesn't 1fr work here? */
  grid-template-columns: 400px calc(100vw - 400px);
  position: absolute;
  top: 0px;
  left: 0px;
}

.hidden {
  display: none;
}

.toggle-button {
  display: none;
  border-radius: 50%;
  border: none;
  height: 50px;
  width: 50px;
  z-index: 10001;
}

#mobile-search-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

#mobile-options-toggle {
  position: fixed;
  bottom: 20px;
  left: 20px;
}

#home-button {
  position: fixed;
  left: calc(50vw - 25px);
  bottom: 20px;
}

.toggle-button svg {
  transform: scale(2);
  margin: 0 auto;
  padding: 0;
  position: relative;
  top: 2px;
}

.toggle-button:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.sidebar-div {
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  background: var(--green-bg);
  box-shadow: 2px 0 3px -1px gray;
  text-align: center;
}

input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid var(--dark-blue);
  background: var(--off-white);
  border-radius: 5px;
}

.mobile-options-visibility-manager {
  display: none;
}

.mobile-search-visibility-manager {
  display: none;
}

@media screen and (max-width: 1000px) {
  .main {
    flex-flow: column;
    overflow-x: hidden;
  }

  .sidebar-div {
    display: none;
  }

  .toggle-button {
    display: initial;
  }

  .mobile-options-visibility-manager {
    display: initial;
    width: 100%;
    min-height: 100vh;
    position: absolute;
    left: -100vw;
    padding: 0;
    margin: 0;
    background: var(--green-bg);
    transition: 0.2s;
  }

  .mobile-search-visibility-manager {
    display: initial;
    width: 100%;
    min-height: 100vh;
    position: absolute;
    right: -100vw;
    padding: 0;
    margin: 0;
    background: var(--green-bg);
    transition: 0.2s;
  }

  .visible-mobile-options {
    display: initial;
    transform: translateX(100vw);
    z-index: 10000;
  }

  .invisible-mobile-options {
    transform: translateX(0vw);
    overflow: hidden;
  }

  .visible-mobile-search {
    display: initial;
    transform: translateX(-100vw);
    z-index: 10000;
  }

  .invisible-mobile-search {
    transform: translateX(0vw);
    overflow: hidden;
  }
}

</style>
