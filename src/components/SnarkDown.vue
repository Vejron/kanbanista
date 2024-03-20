<script setup lang="ts">
import snark from 'snarkdown'
import { onBeforeMount } from 'vue';

const props = defineProps<{
  md?: string
}>()

</script>

<template>
  <div class="markdown-body" v-html="snark(md ?? '')" />
</template>