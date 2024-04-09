<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useDropZone } from '@vueuse/core'
import { TaskStatus, type ITask } from '@/types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";

import Task from '@/components/Task.vue'


const props = defineProps<{
  name: string
  type: TaskStatus
  tasks: ITask[]
}>()

const myTasks = ref<ITask[]>([])
watch(() => props.tasks, (newTasks) => {
  console.log('tasks updated', newTasks)
  myTasks.value = newTasks.filter(task => task.status === TaskStatus.Todo)
  
}, { immediate: true })

const listRef = ref();
dragAndDrop({
  parent: listRef,
  values: myTasks,
  group: 'tasks',
  dragHandle: ".drag-handle",
  plugins: [animations()],
});

</script>

<template>
  <section class="column flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
    <h2 class="text-gray-400 font-medium uppercase text-sm mb-4 flex justify-between">
      Todo
    </h2>
    <ul class="flex-grow" ref="listRef">
      <Task :task="task" v-for="task in tasks" :key="task.id">
      </Task>
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
</style>