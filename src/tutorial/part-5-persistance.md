# Persistance

In this part we will add persistance to our application. At first we will use the browser's local storage to store the tasks. Later we will switch to a more advanced solution using a "real" backend.

## Local storage

Local storage is a simple key-value store that is available in all browser. It's an easy way to persist data in a small application like this. In our case it's as simple as using `useLocalStorage` from `@vueuse/core`. Modify the task creation in `src/persistance.ts` file to look like this:

```ts
<...code above removed for clarity>
import { useLocalStorage } from "@vueuse/core"

const done = useLocalStorage<ITask[]>('done-key', []);
const inProgress = useLocalStorage<ITask[]>('in-progress-key', []);
const todo = useLocalStorage<ITask[]>('todo-key', []);
<...code below removed for clarity>
```

That's it! Now the tasks will be stored in local storage and will be available after the page reloads.

## A "real" backend

Local storage is great n'all, but it has some obvious limitations. For example, it's not shared between different devices. To make our application multiplayer we need a real backend. There are many ways to implement a backend, but doing so is out of scope for this tutorial. Instead we will use a simple backend that is already there. We will use the free MQTT broker at `wss://test.mosquitto.org:8081`. To connect to the broker we will use the `mqtt` library which should already be installed as a dependency. Modify the `src/persistance.ts` file to look like this:

```ts
import { ref } from "vue"
import { type ITask, TaskStatus } from "@/types"
import { watchDebounced, useMousePressed } from "@vueuse/core"
import mqtt, { type MqttClient } from "mqtt";

const done = ref<ITask[]>([]);
const inProgress = ref<ITask[]>([]);
const todo = ref<ITask[]>([]);
const { pressed } = useMousePressed()
let client: MqttClient
const topic = 'wtf_is_this_nonsense_12345/board'
const url = 'wss://test.mosquitto.org:8081/mqtt'

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function update() {
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value,
  }
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true });
  }
}

function remove(task: ITask) {
  todo.value = todo.value.filter(t => t.id !== task.id)
  inProgress.value = inProgress.value.filter(t => t.id !== task.id)
  done.value = done.value.filter(t => t.id !== task.id)
}

function add(task: ITask) {
  const tasks = {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
  }
  tasks[task.status].value.push({ ...task, id: uuid() });
}

function reset() {
  const todo = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: "This task is in the todo list",
      description: '## This is H2\n### This is H3\n#### This is H4\nThen some smallish paragraph',
      priority: 1,
      status: TaskStatus.Todo,
    },
  ]
  const InProgress = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: "This task is in progress. You can drag it to the done list when it's done.",
      description: '## *Cat picture in cursive* ![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)',
      priority: 2,
      status: TaskStatus.InProgress,
    },
  ]
  const done = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: "This task is done. You can drag it back to the todo list if you need to do it again.",
      priority: 3,
      status: TaskStatus.Done,
    },
  ]
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(
      {
        [TaskStatus.Todo]: todo,
        [TaskStatus.InProgress]: InProgress,
        [TaskStatus.Done]: done,
      }
    ), { retain: true });
  }
}

function taskById(id: string) {
  return [...todo.value, ...inProgress.value, ...done.value].find(task => task.id === id)
}

export function usePersistance() {
  if (!client && url) {
    //watch all tasks and update mqtt
    watchDebounced([todo, inProgress, done], () => {
      // only update if mouse is not pressed this is to avoid updating while dragging
      if (!pressed.value) {
        update()
      }
    }, { debounce: 500, deep: true })

    client = mqtt.connect(url);

    client.on("connect", () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log('Subscribed to topic:', topic);
        }
      })
    })

    client.on("message", (topic, buffer) => {
      try {
        const _tasks = JSON.parse(buffer.toString());
        console.log('Received tasks: ', _tasks)

        // update reactive values only if they are different
        if (JSON.stringify(_tasks[TaskStatus.Todo]) !== JSON.stringify(todo.value)) {
          todo.value = _tasks[TaskStatus.Todo]
        }
        if (JSON.stringify(_tasks[TaskStatus.InProgress]) !== JSON.stringify(inProgress.value)) {
          inProgress.value = _tasks[TaskStatus.InProgress]
        }
        if (JSON.stringify(_tasks[TaskStatus.Done]) !== JSON.stringify(done.value)) {
          done.value = _tasks[TaskStatus.Done]
        }
      }
      catch (e) {
        console.error('Error parsing message, probably not valid JSON')
        // replace with fake initial tasks
        reset()
      }
    })
  }

  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    add,
    remove,
    reset,
    taskById,
    update,
  }
}
```

There is a couple of notable changes here. We are using the `mqtt` library to connect to the broker and listen for messages containing our tasks on a specific (retained) topic. These tasks are then parsed and **only** stored if they are different from the current tasks. This is necessary to avoid an infinite loop caused by the reactive nature of Vue refs. Changes to any of tasks are watched and debounced to avoid updating the broker too often.

We are also using the `useMousePressed` composable from `@vueuse/core` to avoid updating the tasks while dragging them. The `update` function is then exported as way to force update the tasks on the broker after a successful drag and drop operation. This requires a small change in the `KColumn` component. Override the `handleEnd` handler in the `dragAndDrop` function to also call `update`. Our `src/components/KColumn.vue` file should now look like this:

```ts
<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { TaskStatus } from '../types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations, handleEnd } from "@formkit/drag-and-drop"
import { usePersistance } from '../persistance'
import KTask from '../components/KTask.vue'
import KBtn from '../components/KBtn.vue'


const props = defineProps<{
  title: string
  type: TaskStatus
}>()

const router = useRouter()

const persistance = usePersistance()
const tasks = toRef(persistance, props.type)

const listRef = ref()
dragAndDrop({
  parent: listRef,
  values: tasks,
  group: 'tasks',
  dropZoneClass: "dragging",
  plugins: [animations()],
  handleEnd(e) {
    persistance.update()
    handleEnd(e)
  },
})
</script>

<template>
  <section class="w-xs min-w-0 flex flex-col">
    <div class="flex justify-between">
      <h2 class="text-gray-400 font-medium uppercase text-sm mb-4">
        {{ title }} {{ tasks.length }}
      </h2>
      <KBtn icon-only icon="mdi:plus" @click="router.push({ name: 'create-task', params: { type } })" />
    </div>

    <ul class="flex-grow space-y-3" ref="listRef">
      <KTask :task="task" v-for="task in tasks" :key="task.id" />
    </ul>
  </section>
</template>

<style>
.dragging {
  @apply bg-orange-600;
}
</style>
```

## Conclusion

That should be it! Now the tasks will be stored on the broker and will be available to all users connected to the same topic. You can test this by opening the application in two different browsers or on another device. The tasks should be synchronized between them. This is a very crude way of using MQTT and syncing tasks, but it should be enough for this tutorial. In the next part we will use **Github** and **Netlify** to deploy our application to the "cloud".
