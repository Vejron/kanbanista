<script setup lang="ts">
import { useMqtt } from '@/services/mqtt';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const { debouncedUpdate } = useMqtt()

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits(['update:modelValue'])

const levels = [
  { label: 'Lowest', icon: 'mdi:chevron-double-down', color: 'text-blue-400' },
  { label: 'Low', icon: 'mdi:chevron-down', color: 'text-green-300' },
  { label: 'Medium', icon: 'mdi:equal', color: 'text-yellow-300' },
  { label: 'High', icon: 'mdi:chevron-up', color: 'text-orange-400' },
  { label: 'Highest', icon: 'mdi:chevron-double-up', color: 'text-red-500' },
]

const priority = computed(() => levels[props.modelValue])

function updatePriority() {
  const next = (props.modelValue + 1) % levels.length
  emit('update:modelValue', next)
  debouncedUpdate()
}
</script>

<template>
  <button
    class="border-none bg-transparent w-6 h-6 text-xl rounded-full grid place-content-center hover:bg-black/20 transition-colors duration-200"
    @click="updatePriority">
    <Icon :icon="priority.icon" :class="priority.color" />
  </button>
</template>