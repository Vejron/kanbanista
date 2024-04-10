<script setup lang="ts">
import type { ITask } from '@/types';
import { Icon } from '@iconify/vue';
import { useTimeAgo } from '@vueuse/core';
import PriorityToggler from './PriorityToggler.vue';

const props = defineProps<{
  task: ITask
}>()

const createdAt = useTimeAgo(props.task.created);
const avatar = `https://i.pravatar.cc/64?img=${props.task.id}`;

</script>

<template>
  <li class="flex gap-4 bg-slate-800 rounded-md border-red border-1 border">
    <div class="drag-handle w-10 flex-none cursor-grab dots-bg" />
    <div class="py-2.5 pr-4 min-w-0">
      <RouterLink class="block group hover:text-red" :to="{ name: 'task', params: { taskId: task.id } }">
        <h3 class="flex justify-between items-center">
          <span class="truncate">{{ task.title ?? 'No title' }}</span>
          <Icon icon="mdi:pencil" class="ml-2 text-transparent group-hover:text-red" />
        </h3>
      </RouterLink>
      <div class="description min-w-0">
        {{ task.description ?? 'Description missing...' }}
      </div>
      <div class="flex justify-between items-center mt-2">
        <time>{{ createdAt }}</time>
        <div class="flex gap-1">
          <button
            class="border-none bg-slate-700 text-gray-400 w-6 h-6 text-sm rounded-full grid place-content-center hover:bg-black/20 transition-colors duration-200">
            {{ task.id }}
          </button>
          <PriorityToggler v-model="task.priority" />
          <img :key="avatar" :src="avatar" alt="avatar" class="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.dots-bg {
  background-image: radial-gradient(circle, #0000005b 2px, transparent 2px);
  background-size: 6px 6px;
}

.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>