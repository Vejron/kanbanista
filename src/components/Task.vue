<script setup lang="ts">
import type { ITask } from '@/types';
import { Icon } from '@iconify/vue';
import { useTimeAgo } from '@vueuse/core';
import PriorityToggler from './PriorityToggler.vue';
import { ref } from 'vue';

const props = defineProps<{
  task: ITask
}>()

const createdAt = useTimeAgo(props.task.created);
const avatar = `https://i.pravatar.cc/64?img=${props.task.id}`;
const priority = ref(0);



</script>

<template>
  <li class="task border-l-3 border-l-solid border-green-400 bg-slate-800 rounded-md" draggable="true">

    <RouterLink class="edit-link" :to="{ name: 'task', params: { taskId: task.id } }">
      <h3 class="flex-between">
        <span class="min-w-0 truncate">{{ task.title ?? 'No title' }}</span>
        <Icon icon="mdi:pencil" class="ml-2 icon" />
      </h3>
    </RouterLink>
    <div class="description">
      {{ task.description ?? 'Description missing...' }}
    </div>
    <div class="flex-between mt-2">
      <time>{{ createdAt }}</time>
      <div class="flex gap-1">
        <button
          class="border-none bg-slate-700 text-gray-400 w-6 h-6 text-sm rounded-full grid place-content-center hover:bg-black/20 transition-colors duration-200">
          {{ task.id }}
        </button>
        <PriorityToggler v-model="task.priority" />
        <img :src="avatar" alt="avatar" class="w-6 h-6 rounded-full" />
      </div>
    </div>

  </li>
</template>

<style scoped>
.task {
  padding: .5rem 1rem;
  cursor: grab;
  list-style: none;
  list-style-position: outside;

}

.task h3 {
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: inherit;
}

.edit-link {
  border: none;
  border-radius: 9999px;
  display: block;
  color: var(--color-text);
}

.edit-link:hover,
.edit-link:hover .icon {
  color: hsla(160, 100%, 37%, 1);
}


.icon {
  color: transparent;
  flex: none;
}

.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
}

.task.is-moving {
  opacity: 0.5;
  position: fixed;
}
</style>