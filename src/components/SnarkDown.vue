<script setup lang="ts">
import snark from 'snarkdown'

const props = defineProps<{
  md?: string
}>()

</script>

<template>
  <div class="prose prose-white [&>*:first-child]:mt-0" v-html="snark(md ?? '')" />
</template>