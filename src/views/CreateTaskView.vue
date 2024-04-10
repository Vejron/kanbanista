<script setup lang="ts">
import SnarkDown from '@/components/SnarkDown.vue';
import { useMqtt } from '@/services/mqtt';
import { type ITask, TaskStatus } from "@/types";
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core'

const router = useRouter()
const target = ref<HTMLElement>()
onClickOutside(target, event => router.push({ name: 'board' }))

const { debouncedUpdate } = useMqtt()
const task = ref<ITask>({
  title: '',
  description: '',
  id: '',
  priority: 0,
  status: TaskStatus.Todo,
  assignee: '',
  created: new Date().toISOString(),
})

</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 grid place-content-center">
    <div ref="target" class="bg-slate-100 text-gray-700 rounded-xl w-screen max-w-[calc(100vw-4rem)] m-4  px-6 pt-4">
      <h2 class="text-2xl font-bold mb-4">Create a new task</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1" for="id-title">Title</label>
          <input class="text-field" v-model="task.title" type="text" id="id-title">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1" for="id-description">Description</label>
          <textarea class="text-field" v-model="task.description" id="id-description" rows="10">
        </textarea>
        </div>
      </div>
      <div class="flex justify-end gap-4 py-4">
        <button type="button"
          class="text-white outline-none border-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Cancel
        </button>

      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.text-field {
  @apply font-mono border border-solid focus:outline-purple text-base rounded-lg block w-full p-2.5 bg-white border-gray-700 placeholder-gray-400 text-gray-700;
}
</style>
