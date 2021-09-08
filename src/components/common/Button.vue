<template>
    <div id="counter">
      <button>
        {{ label }}
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      counter: 0
    }
  },
  props: [
    'callback',
    'label'
  ]
})
</script>
