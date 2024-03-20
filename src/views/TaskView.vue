<script setup lang="ts">
import SnarkDown from '@/components/SnarkDown.vue';
import { useMqtt } from '@/services/mqtt';
import type { ITask } from '@/types';
import { watchDebounced } from '@vueuse/core';
import { computed, watch } from 'vue';


const props = defineProps<{
  taskId: string
}>()

const { tasks, update } = useMqtt()

function isTaskDeepEqual(a: ITask | undefined, b: ITask| undefined) {
  return a?.id === b?.id && a?.title === b?.title && a?.description === b?.description
}

const task = computed(() => {
  const _task = tasks.value.find(task => task.id === props.taskId)
  return _task
})

/* const title = computed({
  get() {
    return task.value?.title
  },
  set(value) {
    console.log('setting title', value)
    const _task = tasks.value.find(task => task.id === props.taskId)
    if(_task?.title) {
      _task.title = value ?? ''
      //update(tasks.value)
    }
  },
}); */


/* watchDebounced(task,( newTask, oldTask) => {
    console.log('task edited!', newTask?.title, oldTask?.title)
    if(isTaskDeepEqual(newTask, oldTask)) {
      return
    }
    update(tasks.value)
  },
  { 
    debounce: 500,
    maxWait: 2000,
    deep: true 
  },
) */
</script>

<template>
  <div class="border-b-2 border-b-solid py-4">
    <div v-if="task" class="m-auto max-w-xl space-y-4">
      <div>
        <label class="block font-semibold mb-2" for="id-title">Title</label>
        <input class="px-4 py-2 max-w-full min-w-0 w-full" v-model="task.title" type="text" id="id-title">
      </div>

      <SnarkDown class="" :md="task?.description ?? ''" />
      <div v-if="task?.description">
        <label class="block font-semibold mb-2" for="id-description">Edit description</label>

        <textarea class="w-full rounded-lg p-4" v-model="task.description" id="id-description" rows="10"></textarea>
      </div>
    </div>

  </div>
</template>
