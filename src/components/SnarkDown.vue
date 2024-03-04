<script setup lang="ts">
import snark from 'snarkdown'
import { onBeforeMount } from 'vue';

const props = defineProps<{
  md?: string
}>()

const description = `
#dddd _this_ is 
**easy** to.
- sdsdsd
- sdsdds`
onBeforeMount(() => {
  console.log('SnarkDown component mounted')
  console.log('Markdown:', snark('# Design UI for the task board in Figma  ## Create a simple UI for the task board in Figma' ?? ''))
})
</script>

<template>
  <div class="markdown-body" v-html="snark(md ?? '')" />
</template>