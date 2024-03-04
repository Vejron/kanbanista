<script setup lang="ts">
import SnarkDown from '@/components/SnarkDown.vue';
import { getTask } from '@/services/task.service';
import type { ITask } from '@/types';
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

const props = defineProps<{
  taskId: string
}>()

const task = ref<ITask>()
onBeforeMount(fetchTask)
onBeforeRouteUpdate(fetchTask)

async function fetchTask() {
  task.value = await getTask(props.taskId)
  console.log('fetching task')
}

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
