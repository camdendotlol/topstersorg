<template>
  <div>
    <h1>Create a chart</h1>
    <Button label='hello' />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../common/Button.vue'

enum ChartTypes {
  Album,
  Book
}

export default defineComponent({
  data () {
    return {
      chartType: ChartTypes.Book,
      chartTypes: ChartTypes
    }
  },
  components: {
    Button
  }
})
</script>
