<script setup lang="ts">
import PageTitle from '../PageTitle.vue'
import SearchBox from './SearchBox/index.vue'
import Options from './Options.vue'
import Imports from './Imports.vue'
import FAQ from './FAQ.vue'
import Changelog from './Changelog.vue'
import Tabs from './Tabs.vue'
import { Ref, ref } from 'vue'
import { Tabs as TabsEnum } from '../../types'

const tabs: TabsEnum[] = [
  TabsEnum.AddItems,
  TabsEnum.Options,
  TabsEnum.Exports,
  TabsEnum.Imports,
  TabsEnum.FAQ,
  TabsEnum.Changelog
]

const currentTab: Ref<TabsEnum> = ref(Tabs.AddItems)

const setCurrentTab = (tab: TabsEnum) => {
  currentTab.value = tab
}

const getTabComponent = (selected: TabsEnum) => {
  switch (selected) {
    case TabsEnum.AddItems:
      return SearchBox
    case TabsEnum.Options:
      return Options
    case TabsEnum.Imports:
      return Imports
    case TabsEnum.Exports:
      return Imports
    case TabsEnum.Changelog:
      return Changelog
    case TabsEnum.FAQ:
      return FAQ
  }
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-block">
      <PageTitle />
    </div>
    <div class="sidebar-block">
      <Tabs
        :tabs="tabs"
        :currentTab="currentTab"
        @setCurrentTab="setCurrentTab"
      />
      <div class="sidebar-content">
        <SearchBox v-if="currentTab === TabsEnum.AddItems" />
        <Options v-if="currentTab === TabsEnum.Options" />
        <Imports v-if="currentTab === TabsEnum.Imports" />
        <Imports v-if="currentTab === TabsEnum.Exports" />
        <Changelog v-if="currentTab === TabsEnum.Changelog" />
        <FAQ v-if="currentTab === TabsEnum.FAQ" />
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
        <p>topsters.org is not affiliated with or endorsed by any of the above services.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-block {
  margin: 12px;
  width: 400px;
  flex-shrink: 0;
  overflow-y: scroll;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 10px;
  text-align: center;
}

.sidebar-content {
  padding: 20px;
  text-align: left;
  max-height: 600px;
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
