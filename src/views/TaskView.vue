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
  <div class="task-container">
    <div class="center">
      <SnarkDown :md="task?.description ?? ''" />
      <div>
        <label for="edit-box">Review of W3Schools:</label>

        <textarea id="edit-box" rows="10"></textarea>
      </div>
    </div>

  </div>
</template>

<style scoped>
.task-container {
  border-bottom: 3px solid var(--color-border);
}

.center {
  margin: 0 auto;
  max-width: 65ch;
}

textarea {
  width: 100%;

  margin-top: 1rem;
  border: 3px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
}
</style>
