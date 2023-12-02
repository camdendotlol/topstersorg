<script setup lang="ts">

</script>

<template>
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
</template>

<style scoped>
#credits {
  text-align: center;
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
</style>
