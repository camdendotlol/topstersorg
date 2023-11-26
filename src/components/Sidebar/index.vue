<script setup lang="ts">
import PageTitle from '../PageTitle.vue'
import SearchBox from './SearchBox/index.vue'
import Options from './Options.vue'
import Imports from './Imports/index.vue'
import Info from './Info.vue'
import Tabs from './Tabs.vue'
import { Ref, ref } from 'vue'
import { Tabs as TabsEnum } from '../../types'

const tabs: TabsEnum[] = [
  TabsEnum.AddItems,
  TabsEnum.Options,
  TabsEnum.ImportsExports,
  TabsEnum.Info
]

const currentTab: Ref<TabsEnum> = ref(TabsEnum.AddItems)

const setCurrentTab = (tab: TabsEnum) => {
  currentTab.value = tab
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-block">
      <PageTitle />
    </div>
    <div class="tabbed-sidebar-block">
      <Tabs
        :tabs="tabs"
        :currentTab="currentTab"
        @setCurrentTab="setCurrentTab"
      />
      <div class="sidebar-content">
        <SearchBox v-if="currentTab === TabsEnum.AddItems" />
        <Options v-else-if="currentTab === TabsEnum.Options" />
        <Imports v-else-if="currentTab === TabsEnum.ImportsExports" />
        <Info v-else-if="currentTab === TabsEnum.Info" />
      </div>
    </div>
    <div class="sidebar-block">
      <div id="credits">
        <p>Data credits:</p>
        <div id="credits-flex">
          <a href="https://www.last.fm/">
            <img src="/lastfm_logo.svg" alt="Last.fm">
          </a>
          <a href="https://openlibrary.org/">
            <img src="/ia_logo.svg" alt="OpenLibrary" id="ia-logo">
          </a>
          <a href="https://www.igdb.com">
            <img src="/igdb_logo.png" alt="IGDB" id="igdb-logo">
          </a>
          <a href="https://www.themoviedb.org">
            <img src="/tmdb.svg" alt="The Movie DB" id="tmdb-logo">
          </a>
        </div>
        <p>Topsters 3 is not affiliated with or endorsed by any of the above services.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-block {
  margin: 10px;
  width: 400px;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 10px;
  text-align: center;
  padding: 16px;
}

.tabbed-sidebar-block {
  margin: 10px;
  width: 400px;
  text-align: center;
}

.sidebar-content {
  text-align: left;
  max-height: 480px;
  overflow-y: auto;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 0 10px 10px 10px;
  padding: 16px;
}

#credits-flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#credits-flex img {
  width: 70px;
}

#tmdb-logo {
  height: 32px;
}

#ia-logo {
  filter: invert(1);
  height: 44px;
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 100%;
    z-index: 10000;
  }
}

</style>
