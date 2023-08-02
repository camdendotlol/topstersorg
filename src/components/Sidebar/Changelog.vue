<script setup lang="ts">
import { ChangelogItem } from '../../types'

const changes: ChangelogItem[] = [
  {
    date: new Date('August 2, 2023').toLocaleDateString(),
    text: 'Updated the search backend for games to support double the previous number of searches per second. This should fix the intermittently failing game searches.'
  }
]
</script>

<template>
  <div id="changelog">
    <div class="container">
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
  </div>
</template>

<style scoped>
#changelog {
  display: flex;
  background: var(--blue-bg);
  margin-top: 0;
  padding: 0;
  border-radius: 0 0 5px 5px;
  text-align: left;
  overflow-y: scroll;
  max-height: 500px;
}

ul {
  padding: 0;
}

li {
  list-style-type: none;
  margin-bottom: 10px;
}

.container {
  width: 100%;
  margin: auto 10px;
}

</style>
