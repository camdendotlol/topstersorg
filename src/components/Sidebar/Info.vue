<script setup lang="ts">
import { ChangelogItem } from '../../types'

const changes: ChangelogItem[] = [
  {
    date: new Date('June 22, 2024').toLocaleDateString(),
    text: 'Optimized the way the chart is rendered. The most significant change is that we\'re now using a separate Canvas layer for drag-and-drop, which should improve the framerate when moving items around on larger charts.'
  },
  {
    date: new Date('January 27, 2024').toLocaleDateString(),
    text: 'Redesigned with a sleek new dark theme for a belated celebration of Topsters 3\'s second birthday. In addition to a total UI overhaul, this redesign adds a chart export feature and enables some UI elements on mobile that were previously hidden on small screens.'
  },
  {
    date: new Date('August 2, 2023').toLocaleDateString(),
    text: 'Updated the search backend for games to support double the previous number of searches per second. This should fix the intermittently failing game searches.'
  },
  {
    date: new Date('July 29, 2023').toLocaleDateString(),
    text: 'Fixed the Topsters 2 import feature, which had been broken since the previous update.'
  },
  {
    date: new Date('May 30, 2023').toLocaleDateString(),
    text: 'Added the ability to build a chart with your Last.fm listening stats in the Imports panel.'
  },
  {
    date: new Date('January 14, 2023').toLocaleDateString(),
    text: 'Overhauled the frontend build process to use Vite and a newer version of Vue. No visible changes, but it should improve performance and make updates easier.'
  }
]
</script>

<template>
  <div>
    <h2>Changelog</h2>
    <ul>
      <li
        v-for="change in changes"
        v-bind:key="change.date"
      >
        <strong>{{ change.date }}</strong>
        {{ change.text }}
      </li>
    </ul>
  </div>
  <div id="faq">
    <h2>Frequently Asked Questions</h2>
    <h3>Why can't I find any King Crimson albums?</h3>
    <p>Not everything in the databases has cover art attached. Because charts require cover art, Topsters 3 filters out items that are missing it. For example, occasionally a band decides they don't want their cover art to appear in databases anymore, so they file a copyright takedown. You may have seen this happen on other sites such as Rate Your Music. This is very rare but it can affect popular items--as of this writing, all of King Crimson's releases are missing album art on Last.fm and as a result will not appear in search results.</p>
    <h3>Why is it called Topsters 3?</h3>
    <p>The topster concept has been around for a while. Topsters 1 shut down years ago and Topsters 2 doesn't support games, books, or TV shows. That's why I made a new one.</p>
    <h3>Why is book searching slow, why does it sometimes not work, why is it missing a book, etc.?</h3>
    <p>I'm using OpenLibrary, which is affiliated with the Internet Archive and runs on donations. The music and games APIs are both from companies that can afford top-tier reliability. But OpenLibrary is a bit less reliable. Don't judge them too much for it, and maybe <a href="https://archive.org/donate/?platform=ol&origin=olwww-TopNavDonateButton">donate to them</a> to help them improve their services.</p>
  </div>
</template>

<style scoped>
h2 {
  margin: 0;
}
ul {
  padding: 0;
  font-size: 0.9rem;
}

li {
  list-style-type: none;
  margin-bottom: 10px;
}
#faq {
  font-size: 0.9rem;
}
</style>
