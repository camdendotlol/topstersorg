<script setup lang="ts">
import PageTitle from '../PageTitle.vue'
import SearchBox from './SearchBox/index.vue'
import Options from './Options.vue'
import Imports from './Imports.vue'
import FAQ from './FAQ.vue'
import Changelog from './Changelog.vue'
import SidebarItem from './SidebarItem.vue'
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <PageTitle />
      <SidebarItem :defaultOpen="true" label="Add Items">
        <SearchBox />
      </SidebarItem>
      <SidebarItem :defaultOpen="false" label="Options">
        <Options />
      </SidebarItem>
      <SidebarItem :defaultOpen="false" label="Imports">
        <Imports />
      </SidebarItem>
      <SidebarItem :defaultOpen="false" label="FAQ">
        <FAQ />
      </SidebarItem>
      <SidebarItem :defaultOpen="false" label="Changelog">
        <Changelog />
      </SidebarItem>
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
#credits-flex {
  display: flex;
  margin: 0 auto;
  width: 90%;
  justify-content: center;
  align-items: center;
  gap: 10px;
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
