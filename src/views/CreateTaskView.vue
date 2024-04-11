<script setup lang="ts">
import { useMqtt } from '@/services/mqtt';
import { type ITask, TaskStatus } from "@/types";
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core'
import SnarkDown from '@/components/SnarkDown.vue';

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
  // add the task and modify the status to the current column
  add({ ...task, status: props.type, created: new Date().toISOString() })
  // then close the "modal" by navigating back to the board
  router.push({ name: 'board' })
}

</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 grid place-content-center">
    <div class="w-screen px-4 max-w-3xl">
      <div ref="target" class="bg-slate-900 text-gray-300 rounded-xl px-6 pt-4">
        <h2 class="text-2xl font-bold mb-4">Create new <i class="italic text-purple-700">{{ what }}</i> task</h2>


        <div class="grid grid-cols-20 gap-4">
          <div class="col-span-15">
            <label class="text-gray-400 block text-sm font-semibold mb-2" for="id-title">Title</label>
            <input class="text-field focus:ring-purple focus:ring-2 mb-5" v-model="task.title" type="text"
              id="id-title">
          </div>
          <div class="col-span-5">
            <label class="text-gray-400 block text-sm font-semibold mb-2" for="id-priority">Priority</label>
            <select
              class="!text-base bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              v-model="task.priority">
              <option disabled value="">Please select one</option>
              <option value="0">None</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
              <option value="4">Very high</option>
            </select>
          </div>
        </div>


        <label class="text-gray-400 flex justify-between text-sm font-semibold mb-2" for="id-description">Description
          <span>Markdown preview</span></label>
        <div
          class="relative focus-within:ring-purple focus-within:ring-2 overflow-hidden w-full h-[40vh] grid grid-cols-20 rounded-lg">
          <textarea class="text-field !rounded-none resize-none h-[40vh] col-span-15" v-model="task.description"
            id="id-description" />
          <SnarkDown class="p-4 h-[40vh] text-[.5em] overflow-auto col-span-5 bg-slate-800 border-l-2 border-slate-700"
            :md="task?.description" />
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
  @apply font-mono border-none outline-none text-base rounded-lg block w-full px-4 py-3 bg-slate-800 placeholder-gray-400 text-gray-200;
}
</style>
