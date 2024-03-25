<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { TaskStatus, type ITask } from '@/types'
import { useMqtt } from '../services/mqtt'
import { Icon } from '@iconify/vue'

import Task from '@/components/Task.vue'
import Column from '@/components/Column.vue'

const props = defineProps<{
  boardId: string
}>()



const { tasks, update, clear } = useMqtt("ws://test.mosquitto.org:8080/mqtt")

const columns = computed(() => [
  {
    name: 'Todo',
    state: TaskStatus.Todo,
    tasks: tasks.value.filter(task => task.status === TaskStatus.Todo)
  },
  {
    name: 'In progress',
    state: TaskStatus.InProgress,
    tasks: tasks.value.filter(task => task.status === TaskStatus.InProgress)
  },
  {
    name: 'Done',
    state: TaskStatus.Done,
    tasks: tasks.value.filter(task => task.status === TaskStatus.Done)
  },
])

onBeforeMount(async () => {
  // fetch the tasks for the board
  //tasks.value = await fetchTasks(props.boardId)
})


function onDragStart(task: ITask, e: any) {
  // use the somewhat clunky native drag and drop API to set a reference to the task being dragged
  e.dataTransfer.clearData();
  e.dataTransfer.setData('text/plain', task.id)
}

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
    <RouterView></RouterView>
    <div class="columns-wrapper">
      <div class="columns-container">
        <template v-for="column in columns" :key="column.name">
          <Column v-bind="column" @task-dropped="onTaskDropped">
            <Task @dragstart="onDragStart(task, $event)" :task="task" v-for="task in column.tasks" :key="task.id">
            </Task>
            <div class="flex mt-4 justify-center">
              <button
                class="rounded-full border-none w-10 h-10 grid place-content-center transition-colors text-gray-400 bg-slate-800 hover:bg-green-500 hover:text-black">
                <Icon class="text-xl text-inherit" icon="mdi:plus" />
              </button>
            </div>
          </Column>
        </template>
      </div>
    </div>
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

.columns-wrapper {
  display: grid;
  justify-content: center;
  flex-grow: 1;
}

.columns-container {
  display: flex;
  position: relative;
  flex-direction: row;
  overflow: hidden;
}

.divider {
  width: 1.5px;
  background-color: var(--color-border);
}

.divider:last-child {
  display: none;
}
</style>
