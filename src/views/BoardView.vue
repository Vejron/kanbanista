<script setup lang="ts">
import { computed, onBeforeMount, watch, ref } from 'vue'
import { TaskStatus, type ITask } from '@/types'
import { useMqtt } from '../services/mqtt'
import { Icon } from '@iconify/vue'
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";

import Task from '@/components/Task.vue'
import Column from '@/components/Column.vue'

const props = defineProps<{
  boardId: string
}>()

const { tasks, update, clear } = useMqtt("ws://test.mosquitto.org:8080/mqtt")


const todoTasks = ref<ITask[]>([])
const inProgressTasks = ref<ITask[]>([])
const doneTasks = ref<ITask[]>([])
watch(() => tasks.value, (newTasks) => {
  console.log('tasks updated', newTasks)
  todoTasks.value = newTasks.filter(task => task.status === TaskStatus.Todo)
  inProgressTasks.value = newTasks.filter(task => task.status === TaskStatus.InProgress)
  doneTasks.value = newTasks.filter(task => task.status === TaskStatus.Done)
}, { immediate: true })
/* 
const todoListRef = ref();
dragAndDrop({
  parent: todoListRef,
  values: todoTasks,
  group: 'tasks',
  dragHandle: ".drag-handle",
  plugins: [animations()],
}); */

const inProgressListRef = ref();
dragAndDrop({
  parent: inProgressListRef,
  values: inProgressTasks,
  group: 'tasks',
  dragHandle: ".drag-handle",
  plugins: [animations()],
});

const doneListRef = ref();
dragAndDrop({
  parent: doneListRef,
  values: doneTasks,
  group: 'tasks',
  dragHandle: ".drag-handle",
  plugins: [animations()],
});

function onTaskDropped(taskId: string, status: TaskStatus) {
  // when the task is dropped, find it and then update the status of the task
  const task = tasks.value.find(task => task.id === taskId)
  if (task) {
    task.status = status
  }
  update(tasks.value)
}
</script>

<template>
  <section class="flex flex-col flex-1">
    <h1 class="text-4xl font-bold text-center mb-4">Board for <span class="text-green-400 font-black tracking-wider">{{
        boardId }}</span>
      <button @click="clear">clear</button>
    </h1>
    <div class="flex flex-grow justify-center overflow-hidden">
        <!-- <section class="column flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
          <h2 class="text-gray-400 font-medium uppercase text-sm mb-4 flex justify-between">
            Todo
          </h2>
          <ul class="flex-grow" ref="todoListRef">
            <Task :task="task" v-for="task in todoTasks" :key="task.id">
            </Task>
          </ul>
        </section> -->
        <Column name="Todo" :tasks="todoTasks" :type="TaskStatus.Todo"></Column>

        <section class="column flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
          <h2 class="text-gray-400 font-medium uppercase text-sm mb-4 flex justify-between">
            In progress
          </h2>
          <ul class="flex-grow" ref="inProgressListRef">
            <Task :task="task" v-for="task in inProgressTasks" :key="task.id">
            </Task>
          </ul>
        </section>

        <section class="column flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
          <h2 class="text-gray-400 font-medium uppercase text-sm mb-4 flex justify-between">
            Done
          </h2>
          <ul class="flex-grow" ref="doneListRef">
            <Task :task="task" v-for="task in doneTasks" :key="task.id">
            </Task>
          </ul>
        </section>
    </div>
    <RouterView></RouterView>
  </section>
</template>

<style scoped>
.board-heading {
  text-align: center;
  padding-bottom: 1rem;
  font-size: 2.25rem;
  font-weight: 600;
  border-bottom: 1.5px solid var(--color-border);
}

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
</style>
