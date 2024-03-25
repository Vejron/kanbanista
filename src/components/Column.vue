<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { type ITask, type TaskStatus } from '@/types'


const props = defineProps<{
  name: string
  state: TaskStatus
  tasks?: ITask[]
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
  <section ref="dropZoneRef" class="column first:rounded-tl-xl last:rounded-tr-xl"
    :class="isOverDropZone ? 'bg-slate-700/40' : 'bg-slate-800/20'">
    <h2 class="text-gray-400 font-medium uppercase text-sm mb-4 flex justify-between">
      <span>{{ name + ' ' + tasks?.length }}</span>
    </h2>
    <ul>
      <slot>


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