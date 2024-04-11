<script setup lang="ts">
import { useMqtt } from '@/services/mqtt';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core'
import SnarkDown from '@/components/SnarkDown.vue';


const props = defineProps<{
  taskId: string
}>()

const router = useRouter()
const target = ref<HTMLElement>()

onClickOutside(target, event => router.push({ name: 'board' }))

const { taskById, debouncedUpdate } = useMqtt()

const task = computed(() => taskById(props.taskId))

function update(what: 'title' | 'description', value: string) {
  // it would have been nice to use v-model two way binding here but it doesn't work with the reactive mqtt backend
  // as it causes an infinite loop of updates

  // update the correct field of the task
  if (task.value) {
    task.value[what] = value
  }
  debouncedUpdate()
}

function deleteTask(task) {
  if (task) {
    // remove the task and navigate back to the board
    //task.remove()
    router.push({ name: 'board' })
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 grid place-content-center">
    <div ref="target" class="bg-slate-900 rounded-xl p-6">
      <div v-if="task" class="m-auto max-w-xl space-y-4">
        <div>
          <label class="block font-semibold mb-2" for="id-title">Title</label>
          <input class="text-field" :value="task.title" @input="update('title', $event?.target?.value)" type="text"
            id="id-title">
        </div>

        <SnarkDown class="p-4 rounded-lg" :md="task?.description ?? ''" />
        <div v-if="task?.description">
          <label class="block font-semibold mb-2" for="id-description">Edit description</label>

          <textarea class="text-field" :value="task.description" @input="update('description', $event?.target?.value)"
            id="id-description" rows="10">
        </textarea>
        </div>
      </div>
      <div class="flex justify-end gap-4 py-4">
        <button type="button" @click="deleteTask(task)"
          class="text-white outline-none border-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Delete
        </button>
        <button type="button" @click="router.push({ name: 'board' })"
          class="text-white outline-none border-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.text-field {
  @apply font-mono border-solid text-base rounded-lg block w-full p-2.5 bg-slate-900 border-gray-700 placeholder-gray-400 text-white;
}
</style>
