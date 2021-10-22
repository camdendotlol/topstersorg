<template>
  <div class="main">
    <div class="sidebar-div">
      <button type="button" id="mobile-burger-toggle" @click="toggleSidebarDisplay">
        <BIconGearFill />
      </button>
      <div class="sidebar-visiblity-manager" :class="showMobileSidebar ? 'visible-sidebar' : 'invisible-sidebar'">
        <Sidebar @toggleSidebarDisplay="toggleSidebarDisplay" />
      </div>
    </div>
    <ChartBuilder />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import ChartBuilder from './components/ChartBuilder/index.vue'
import { BIconGearFill } from 'bootstrap-icons-vue'

export default defineComponent({
  name: 'Ostrakon',
  components: {
    Sidebar,
    ChartBuilder,
    BIconGearFill
  },
  data () {
    return {
      showMobileSidebar: false
    }
  },
  methods: {
    toggleSidebarDisplay () {
      this.showMobileSidebar = !this.showMobileSidebar
    }
  }
})

</script>

<style>
#app {
  font-family: "Ubuntu Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #00003f;
  overflow-y: hidden;
}

body {
  background: #2a2a2a;
  box-sizing: border-box;
}

.main {
  height: 100vh;
  width: 100vw;
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 0;
}

#mobile-burger-toggle {
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  border: none;
  height: 3rem;
  width: 3rem;
}

#mobile-burger-toggle svg {
  transform: scale(2);
  margin: 0 auto;
  padding: 0;
  position: relative;
  top: 2px;
}

#mobile-burger-toggle:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.sidebar-div {
  margin: 0;
  padding: 0;
  width: 400px;
  flex-shrink: 0;
  overflow-y: scroll;
  background: #AAE5CA;
  box-shadow: 2px 0 3px -1px gray;
  text-align: center;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: none;
  background: #e9e9e9;
  border-radius: 10px;
}

@media screen and (max-width: 1000px) {
  .main {
    flex-flow: column;
    overflow-x: hidden;
  }

  #mobile-burger-toggle {
    display: initial;
    z-index: 1000;
  }

  .sidebar-visiblity-manager {
    transition: 0.2s;
    width: 100%;
    position: absolute;
    right: -100vw;
    transition: 0.2s;
    padding: 0;
    margin: 0;
    background: #AAE5CA;
  }

  .invisible-sidebar {
    transform: translateX(0vw);
    height: 100vh;
    overflow: hidden;
  }

  .visible-sidebar {
    display: initial;
    transform: translateX(-100vw);
  }
}

</style>
