<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { Tabs as TabsEnum } from '../../types'
import PageTitle from '../PageTitle.vue'
import Credits from './Credits.vue'
import Imports from './Imports/index.vue'
import Info from './Info.vue'
import Options from './Options.vue'
import SearchBox from './SearchBox/index.vue'
import Tabs from './Tabs.vue'

const tabs: TabsEnum[] = [
  TabsEnum.AddItems,
  TabsEnum.Options,
  TabsEnum.ImportsExports,
  TabsEnum.Info,
]

const currentTab: Ref<TabsEnum> = ref(TabsEnum.AddItems)

function setCurrentTab(tab: TabsEnum) {
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
        :current-tab="currentTab"
        @set-current-tab="setCurrentTab"
      />
      <div class="sidebar-content">
        <SearchBox v-if="currentTab === TabsEnum.AddItems" />
        <Options v-else-if="currentTab === TabsEnum.Options" />
        <Imports v-else-if="currentTab === TabsEnum.ImportsExports" />
        <Info v-else-if="currentTab === TabsEnum.Info" />
      </div>
    </div>
    <div class="sidebar-block">
      <Credits />
    </div>
  </div>
</template>

<style scoped>
.sidebar-block {
  margin: 10px;
  width: 400px;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 6px;
  text-align: center;
  padding: 10px;
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
  border-radius: 0 6px 6px 6px;
  padding: 16px;
}

@media screen and (max-width: 1000px) {
  .sidebar {
    display: none;
  }
}
</style>
