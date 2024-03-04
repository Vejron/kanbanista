<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { type TaskStatus } from '@/types'


const props = defineProps<{
  name: string
  state: TaskStatus
}>()

const emit = defineEmits(['taskDropped'])


const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
})

function onDrop(files: any, e: any) {
  console.log('dropped', e)
  // called when files are dropped on zone

  // Get the data, which is the id of the source element
  const data = e.dataTransfer.getData("text");
  console.log('with', data)
  emit('taskDropped', data, props.state)
}

</script>

<template>
  <section ref="dropZoneRef" class="column" :class="{ 'column--drop-over': isOverDropZone }">
    <h2 class="truncate">{{ name }}</h2>
    <ul>
      <slot>
        Column is empty..
      </slot>
    </ul>
  </section>
</template>

<style scoped>
.column {
  padding: 1rem;
  min-width: 0;
  width: 40ch;
  transition: background-color 0.2s ease;
}

.column h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.column ul {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.column.column--drop-over {
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>