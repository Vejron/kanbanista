<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { TaskStatus } from '@/types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { useMqtt } from '@/services/mqtt';
import { animations, remapNodes } from "@formkit/drag-and-drop";
import Task from '@/components/Task.vue'
import { Icon } from '@iconify/vue';


const props = defineProps<{
  title: string
  type: TaskStatus
}>()

const mqtt = useMqtt("ws://test.mosquitto.org:8080/mqtt")

const tasks = toRef(mqtt, props.type)
const listRef = ref()
dragAndDrop({
  parent: listRef,
  values: tasks,
  group: 'tasks',
  dragHandle: ".drag-handle",
  //plugins: [animations()],
  handleEnd: (data) => {
    console.log('dragged-end', data)
    mqtt.debouncedUpdate()
  },
})

watch(tasks, () => {
  // WORKAROUND: as the tasks change, we need to remap the nodes because the dragAndDrop library doesn't
  // update the nodes as it should
  setTimeout(() => {
    remapNodes(listRef.value)
  }, 0)
})

</script>

<template>
  <section class="w-xs min-w-0 flex flex-col first:rounded-tl-xl last:rounded-tr-xl">
    <div class="flex justify-between">
      <h2 class="text-gray-400 font-medium uppercase text-sm mb-4">
      {{ title }} {{ tasks.length }}
    </h2>
    <button
    class="border-none bg-transparent w-6 h-6 text-xl rounded-full grid place-content-center hover:bg-white/20 transition-colors duration-200">
    <Icon icon="mdi:chevron-double-down" class="text-white" />
  </button>
    </div>
  
    <ul class="flex-grow space-y-3" ref="listRef">
      <Task :task="task" v-for="task in tasks" :key="task.id">
      </Task>
    </ul>
  </section>
</template>