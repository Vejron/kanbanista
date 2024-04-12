<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = withDefaults(defineProps<{
  icon?: string
  color?: 'primary' | 'warning'
  variant?: 'filled' | 'text'
  iconOnly?: boolean
}>(), {
  variant: 'filled',
  color: 'primary',
})

const primaryColors = 'bg-purple-600 text-white'
const warningColors = 'bg-red-600 text-yellow-200'

</script>

<template>
  <button
    class="relative border-none shadow-none px-4 py-2 text-base font-semibold rounded-lg flex items-center justify-center"
    :class="[color === 'primary' ? primaryColors : warningColors, variant === 'filled' ? '' : '']"
  >
    <Icon v-if="icon" :icon="icon" class="mr-2" />
    <slot />
    <span class="absolute transition-opacity duration-300 hover:opacity-15 opacity-0  rounded-lg inset-0 bg-black"></span>
  </button>
</template>