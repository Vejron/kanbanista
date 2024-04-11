<script setup lang="ts">
import { useMqtt } from '@/services/mqtt';
import { type ITask, TaskStatus } from "@/types";
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  type: TaskStatus
}>()

const router = useRouter()
const target = ref<HTMLElement>()
onClickOutside(target, event => router.push({ name: 'board' }))

const { add } = useMqtt()

const what = computed(() =>
  props.type == TaskStatus.Todo ? 'todo' :
    props.type == TaskStatus.InProgress ? 'in progress' :
      'done'
)

const task = ref<ITask>({
  title: '',
  description: '',
  id: '',
  priority: 0,
  status: TaskStatus.Todo,
  assignee: '',
  created: new Date().toISOString(),
})

function addTask(task: ITask) {
  add(task)
  router.push({ name: 'board' })
}

</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 grid place-content-center">
    <div class="w-screen px-4 max-w-3xl">
      <div ref="target" class="bg-slate-900 text-gray-300 rounded-xl px-6 pt-4">
        <h2 class="text-2xl font-bold mb-4">Create new <i class="italic text-purple-700">{{ what }}</i> task</h2>
        <div class="space-y-4">
          <div>
            <label class="text-gray-400 block text-sm font-semibold mb-1" for="id-title">Title</label>
            <input class="text-field" v-model="task.title" type="text" id="id-title">
          </div>
          <div>
            <label class="text-gray-400 block text-sm font-semibold mb-1" for="id-description">Description</label>
            <textarea class="text-field" v-model="task.description" id="id-description" rows="10">
        </textarea>
          </div>
        </div>
        <div class="flex justify-end gap-4 py-4">
          <button type="button" @click="addTask(task)"
            class="text-white outline-none border-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Add task
          </button>
          <button type="button" @click="router.push({ name: 'board' })"
            class="text-white outline-none border-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Cancel
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.text-field {
  @apply font-mono  focus:outline-purple text-base rounded-lg block w-full px-4 py-3 bg-slate-700 border-gray-700 placeholder-gray-400 text-gray-200;
}
</style>
