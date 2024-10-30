<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { Tabs as TabsEnum } from '../../types'
import PageTitle from '../PageTitle.vue'
import Imports from './Imports/index.vue'
import Info from './Info.vue'
import Options from './Options/index.vue'
import Tabs from './Tabs.vue'

const tabs: TabsEnum[] = [
  TabsEnum.Options,
  TabsEnum.ImportsExports,
  TabsEnum.Info,
]

const currentTab: Ref<TabsEnum> = ref(TabsEnum.Options)

function setCurrentTab(tab: TabsEnum) {
  currentTab.value = tab
}
</script>

<template>
  <div class="container">
    <div class="title-container">
      <PageTitle />
    </div>
    <Tabs
      :tabs="tabs"
      :current-tab="currentTab"
      @set-current-tab="setCurrentTab"
    />
    <div class="sidebar-content">
      <div v-if="currentTab === TabsEnum.Options" class="mobile-options-container">
        <Options />
      </div>
      <Imports v-else-if="currentTab === TabsEnum.ImportsExports" />
      <Info v-else-if="currentTab === TabsEnum.Info" />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  padding: 10px 10px 60px;
  margin: auto;
  max-height: 100dvh;
  max-width: 500px;
  overflow-y: auto;
  z-index: 10000;
}

.title-container {
  text-align: center;
  padding: 8px;
}

.sidebar-content {
  background: rgba(20, 20, 20, 0.6);
  border-radius: 0 6px 6px 6px;
  padding: 6px;
}

.mobile-options-container {
  margin-bottom: 20px;
}
</style>
