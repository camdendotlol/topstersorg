<template>
  <button>
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: [
    'label'
  ]
})
</script>
