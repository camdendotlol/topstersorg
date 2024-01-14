<script setup lang="ts">
import { Tabs as TabsEnum } from '../../types'
import Tabs from './Tabs.vue'
import Options from './Options.vue'
import Imports from './Imports/index.vue'
import Info from './Info.vue'
import { ref, Ref } from 'vue'
import PageTitle from '../PageTitle.vue'

const tabs: TabsEnum[] = [
  TabsEnum.Options,
  TabsEnum.ImportsExports,
  TabsEnum.Info
]

const currentTab: Ref<TabsEnum> = ref(TabsEnum.Options)

const setCurrentTab = (tab: TabsEnum) => {
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
      :currentTab="currentTab"
      @setCurrentTab="setCurrentTab"
    />
    <div class="sidebar-content">
      <Options v-if="currentTab === TabsEnum.Options" />
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
  border-radius: 0 10px 10px 10px;
  padding: 6px;
}
</style>
