<script setup lang="ts">
import SnarkDown from '@/components/SnarkDown.vue';
import { useMqtt } from '@/services/mqtt';
import type { ITask } from '@/types';
import { computed, ref, watch, watchEffect } from 'vue';


const props = defineProps<{
  taskId: string
}>()

const { tasks, debouncedUpdate } = useMqtt()

const localTask = ref<ITask | undefined>()

watchEffect(() => {
  console.log('task changed from source watcheffect', tasks.value)
  localTask.value = tasks.value.find(task => task.id === props.taskId)
})

function update(what: 'title' | 'description', value: string) {
  console.log('setting ' + what, value)
  if (localTask.value) {
    localTask.value[what] = value
  }
  debouncedUpdate()
}

const task = computed(() => {
  const _task = tasks.value.find(task => task.id === props.taskId)
  return _task
})

</script>

<template>
  <div class="border-b-2 border-b-solid py-4">
    <div v-if="localTask" class="m-auto max-w-xl space-y-4">
      <div>
        <label class="block font-semibold mb-2" for="id-title">Title</label>
        <input class="px-4 py-2 max-w-full min-w-0 w-full" :value="localTask.title"
          @input="update('title', $event.target.value)" type="text" id="id-title">
      </div>

      <SnarkDown class="" :md="localTask?.description ?? ''" />
      <div v-if="localTask?.description">
        <label class="block font-semibold mb-2" for="id-description">Edit description</label>

        <textarea class="w-full rounded-lg p-4" :value="localTask.description"
          @input="update('description', $event.target.value)" id="id-description" rows="10">
        </textarea>
      </div>
    </div>

  </div>
</template>
