<template>
  <div id="imports">
    <div class="container">
      <h2>Coming soon!</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({

})
</script>

<style scoped>
#imports {
  display: flex;
  background: var(--blue-bg);
  margin-top: 0;
  padding: 0;
  border-radius: 0 0 5px 5px;
  text-align: left;
  overflow-y: scroll;
  max-height: 500px;
}

.container {
  width: 100%;
  margin: auto 10px;
}

h2 {
  font-size: 1.2rem;
}

</style>
