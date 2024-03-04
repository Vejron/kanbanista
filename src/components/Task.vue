<script setup lang="ts">
import type { ITask } from '@/types';
import { Icon } from '@iconify/vue';
import { useTimeAgo } from '@vueuse/core';

const props = defineProps<{
  task: ITask
}>()

const createdAt = useTimeAgo(props.task.created);



</script>

<template>
  <li class="task border-l-3 border-l-solid border-green-400 bg-gray-900 rounded-md" draggable="true">

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
      Created:
      <time>{{ createdAt }}</time>
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