<script setup lang="ts">
import type { ITask } from '@/types';
import { useTimeAgo } from '@vueuse/core';
import PriorityToggler from './PriorityToggler.vue';
import SnarkDown from '@/components/SnarkDown.vue';

const props = defineProps<{
  task: ITask
}>()

const createdAt = useTimeAgo(props.task.created);
const avatar = `https://i.pravatar.cc/64?img=${uuidToNumber(props.task.id)}`;

function uuidToNumber(uuid: string) {
  //aggregate the char codes of the uuid and return as a number between 0 and 50
  return uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50;
}
</script>

<template>
  <li class="flex gap-4 bg-slate-800 rounded-md border-slate-800 hover:border-purple-500  border-2.5 transition-all">
    <div class="drag-handle w-9 flex-none cursor-grab grab-bg" />
    <RouterLink class="block w-full group" :to="{ name: 'task', params: { taskId: task.id } }">
      <div class="py-2.5 pr-4 min-w-0 w-full">

        <h3 class="line-clamp-3 min-w-0 mb-2 text-base text-gray-200 group-hover:text-purple-500 transition-colors">
          {{ task.title ?? 'No title' }}
        </h3>

        <div class="overflow-hidden max-h-30">
          <div class="w-[220%] origin-top-left transform scale-40 min-w-0">
            <SnarkDown class="rounded-lg" :md="task?.description" />
        </div>
        </div>
       
        <div class="flex justify-between items-center mt-2">
          <time class="first-letter:capitalize truncate text-gray-400">{{ createdAt }}</time>
          <div class="flex gap-1">
            <button
              class="border-none bg-slate-700 text-gray-400 w-6 h-6 text-sm rounded-full grid place-content-center hover:bg-black/20 transition-colors duration-200">
              {{ uuidToNumber(task.id) }}
            </button>
            <PriorityToggler v-model="task.priority" />
            <img :key="avatar" :src="avatar" alt="avatar" class="w-6 h-6 rounded-full" />
          </div>
        </div>
      </div>
    </RouterLink>
  </li>
</template>

<style scoped>
.grab-bg {
  background-image: radial-gradient(circle, #0000005b 2px, transparent 2px);
  background-size: 6px 6px;
}

.grab-bg::before {
  content: '';
  background-image: radial-gradient(circle, rgb(168 85 247) 2px, transparent 2px);
  background-size: 6px 6px;
  transition: all .2s;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.grab-bg:hover::before {
  opacity: 1;
}

.line-clamp-3 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>