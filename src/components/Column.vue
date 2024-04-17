<script setup lang="ts">
import { ref, toRef } from 'vue'
import { TaskStatus } from '@/types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { useMqtt } from '@/services/mqtt';
import { animations, handleEnd } from "@formkit/drag-and-drop";
import Task from '@/components/Task.vue'
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';


const props = defineProps<{
  title: string
  type: TaskStatus
}>()

const router = useRouter()

function createTask() {
  router.push({ name: 'create-task', params: { type: props.type } })
}

const mqtt = useMqtt()
const tasks = toRef(mqtt, props.type)

const listRef = ref()
dragAndDrop({
  parent: listRef,
  values: tasks,
  group: 'tasks',
  dropZoneClass: "dragging",
  plugins: [animations()],
  // override the default handleEnd function to update the tasks
  // on the broker only after the drag and drop operation is completed
  handleEnd(e) {
    mqtt.update()
    handleEnd(e)
  },
})
</script>

<template>
  <section class="w-xs min-w-0 flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
    <div class="flex justify-between">
      <h2 class="text-gray-400 font-medium uppercase text-sm mb-4">
        {{ title }} {{ tasks.length }}
      </h2>
      <button @click="createTask"
        class="border-none bg-transparent w-6 h-6 text-xl rounded-full grid place-content-center hover:bg-white/10 hover:active:bg-white/30 transition-colors duration-200">
        <Icon icon="mdi:plus" class="text-white" />
      </button>
    </div>

    <ul class="flex-grow space-y-3" ref="listRef">
      <Task :task="task" v-for="task in tasks" :key="task.id">
      </Task>
    </ul>
  </section>
</template>

<style>
.dragging {
  @apply bg-orange-600;
}
</style>