<template>
  <div
    v-for="(result, index) in results"
    :key="index"
  >
    <p>{{ result }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    results: Array,
    isLoading: Boolean
  }
}
</script>

<style scoped>

</style>
