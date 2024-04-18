# The board view

When using any component based framework, it is important to break down the UI into smaller components. This makes the code DRY:er and more maintainable. In this part of the tutorial, we will create a `BoardView` component that will contain all the `KColumn`:s and `KTask`:s of our kanban board. These, in turn, depend on the `KBtn` and `KMarkdown` components. But first we need to define some types and create a simple (mock) backend to store the tasks.

## Typescript definitions and a simple backend

Before we start building the `BoardView` and associated components, let's define some **types** and create a simple service to store the **tasks**. Create a `types.ts` file in the `src` directory with the following content:

```ts
export interface ITask {
  id: string
  created: string
  title: string
  priority: number
  description?: string
  status: TaskStatus
}

export enum TaskStatus {
  Todo,
  InProgress,
  Done
}
```

Then create a `persistance.ts` file in the `src` directory with the following content:

```ts
import { ref } from "vue";
import { type ITask, TaskStatus } from "@/types";

const done = ref<ITask[]>([]);
const inProgress = ref<ITask[]>([]);
const todo = ref<ITask[]>([]);

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
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
  todo.value = [
    {
      id: uuid(),
      created: "2024-03-18T06:10:19.077Z",
      title: "This task is in the todo list",
      description: '## This is H2\n### This is H3\n#### This is H4\nThen some smallish paragraph',
      priority: 1,
      status: TaskStatus.Todo,
    },
  ]
  inProgress.value = [
    {
      id: uuid(),
      created: "2024-04-13T06:10:19.077Z",
      title: "This task is in progress. You can drag it to the done list when it's done.",
      description: '## *Cat picture in cursive* ![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)',
      priority: 2,
      status: TaskStatus.InProgress,
    },
  ]
  done.value = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: "This task is done. You can drag it back to the todo list if you need to do it again.",
      priority: 3,
      status: TaskStatus.Done,
    },
  ]
}

function taskById(id: string) {
  return [...todo.value, ...inProgress.value, ...done.value].find(task => task.id === id)
}

export function usePersistance() {

  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    add,
    remove,
    reset,
    taskById,
  }
}
```

The `usePersistance` function can then be used as a singleton service in any component that needs to interact with our tasks. The `reset` function will load the initial tasks into the columns. The `taskById` function will return a task based on its id. The other functions are pretty self-explanatory.

## The components

The board view component will contain all the columns and tasks of our kanban board. the columns and task will in turn contain two other reusable components, `KBtn` and `KMarkdown`. So to make this as smooth as possible we will create these components first.

### KBtn

This is just a simple button that encapsulates some stylistic choices that we will use throughout the application. Create a `KBtn.vue` file in the `src/components` directory with the following content:

```ts
<script setup lang="ts">
import { Icon } from '@iconify/vue';

withDefaults(defineProps<{
  icon?: string
  iconClasses?: string
  color?: 'primary' | 'warning'
  iconOnly?: boolean
}>(), {
  variant: 'filled',
  color: 'primary',
})

const primaryColors = 'bg-purple-600 border-purple-600 text-white'
const warningColors = 'bg-orange-600 border-orange-600 text-yellow-100'

</script>

<template>
  <button class="relative shadow-none text-base font-semibold gap-2 flex items-center justify-center" :class="[
    color === 'primary' ? primaryColors : warningColors,
    iconOnly ? 'border bg-transparent w-6 h-6 rounded-full hover:bg-white/10 hover:active:bg-white/30 transition-colors duration-200' : 'px-4 py-2 rounded-lg'
  ]">
    <Icon v-if="icon" :icon="icon" :class="iconClasses" />
    <slot />
    <span
      class="absolute transition-opacity duration-300 hover:opacity-15 opacity-0 rounded-lg inset-0 bg-black"></span>
  </button>
</template>
```

### KMarkdown

This component is a minimal wrapper around the `snarkdown` markdown renderer. It also uses the typography preset from UnoCSS to get som default markdown styles. this is also a good example of how to use the builtin `v-html` directive to render raw HTML in a Vue component. Create the `KMarkdown.vue` file in the `src/components` directory with the following content:

```ts
<script setup lang="ts">
import snark from 'snarkdown'

defineProps<{
  md?: string
}>()
</script>

<template>
  <div class="prose prose-white [&>*:first-child]:mt-0" v-html="snark(md ?? '')" />
</template>
```

### KTask

`KTask` represent a task on the board. It's purpose is to display the task's information in a somewhat compact way. This is a non-trivial component that contains some logic for calculating the age of the task and the color of the age indicator. It also contains a function for cycling the priority of the task. The task's description is rendered using the `KMarkdown` component. The task's priority is displayed as an icon with a color that corresponds to the priority level. The task's age is displayed using the `useTimeAgo` composable.

Create the `KTask.vue` file in the `src/components` directory with the following content:

```ts
<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue';
import { usePersistance } from '../persistance';
import type { ITask } from '../types'
import KMarkdown from './KMarkdown.vue'
import KBtn from './KBtn.vue'


const props = defineProps<{
  task: ITask
}>()

const avatar = `https://i.pravatar.cc/64?img=${uuidToNumber(props.task.id)}`

function uuidToNumber(uuid: string) {
  //aggregate the char codes of the uuid and return as a number between 0 and 50
  return uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50
}

const createdAt = useTimeAgo(props.task.created)

const ageColorMap = [
  ['text-blue-400', 'bg-blue-500'],
  ['text-green-300', 'bg-green-500'],
  ['text-yellow-300', 'bg-yellow-500'],
  ['text-orange-400', 'bg-orange-600'],
  ['text-red-500', 'bg-red-600'],
]

function ageToColor(from: string | Date, to: string | Date, maxDaysDuration = 14) {
  // Convert dates to milliseconds for easier calculation
  const fromMs = new Date(from).getTime()
  const toMs = new Date(to).getTime()

  // Calculate the difference between the dates in days
  const diffInDays = (toMs - fromMs) / (1000 * 60 * 60 * 24)

  // Calculate the score
  let score = (diffInDays / maxDaysDuration) * 4

  // Ensure the score is within the range 0-4
  score = Math.floor(Math.min(4, Math.max(0, score)))
  return ageColorMap[score]
}

const priority = computed(() => {
  return [
    { label: 'Lowest', icon: 'mdi:chevron-double-down', color: 'text-blue-400' },
    { label: 'Low', icon: 'mdi:chevron-down', color: 'text-green-300' },
    { label: 'Medium', icon: 'mdi:equal', color: 'text-yellow-300' },
    { label: 'High', icon: 'mdi:chevron-up', color: 'text-orange-400' },
    { label: 'Highest', icon: 'mdi:chevron-double-up', color: 'text-red-500' },
  ][props.task.priority]
})

const { taskById } = usePersistance()

function onCyclePriority() {
  const task = taskById(props.task.id)
  if (!task) return console.error('Task not found')

  task.priority = (task.priority + 1) % 5
}

</script>

<template>
  <li class="flex gap-4 bg-slate-800 rounded-md border-slate-800 hover:border-purple-500  border-2.5 transition-all">
    <div :class="ageToColor(task.created, new Date())[1]" class="w-1 rounded-l-md flex-none" />
    <div class="block w-full group">
      <div class="py-2.5 pr-4 min-w-0 w-full">

        <h3 class="line-clamp-3 min-w-0 mb-2 text-base text-gray-200 group-hover:text-purple-500 transition-colors">
          {{ task.title ?? 'No title' }}
        </h3>

        <div class="relative overflow-hidden max-h-30">
          <div class="text-[0.5rem] opacity-80 min-w-0">
            <KMarkdown :md="task.description" />
          </div>
          <div class="scrim absolute top-0 w-full h-full" />
        </div>

        <div class="flex justify-between items-center mt-2">
          <time :class="ageToColor(task.created, new Date())[0]" class="first-letter:capitalize truncate">
            {{ createdAt }}
          </time>
          <div class="flex gap-2">
            <KBtn icon-only :icon-classes="priority.color" :icon="priority.icon" @click.prevent="onCyclePriority" />
            <img :key="avatar" :src="avatar" alt="avatar" class="w-6 h-6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.scrim {
  background-image: linear-gradient(5.5rem, rgb(30 41 59));
}
</style>
```

### KColumn

`KColumn` represents one column on the board. It contains a title and a list of tasks. The tasks are made draggable thanks to our **drag-and-drop** library and can thus be moved and sorted between colum. this is achieved by feeding the `dragAndDrop` composable with the `tasks` array and a template ref to the containing list element. The `dragAndDrop` composable will then take care of the rest.

Create the `KColumn.vue` file in the `src/components` directory with the following content:

```ts
<script setup lang="ts">
import { ref, toRef } from 'vue'
import { TaskStatus } from '../types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations, handleEnd } from "@formkit/drag-and-drop";
import { usePersistance } from '../persistance'
import KTask from '@/components/KTask.vue'


const props = defineProps<{
  title: string
  type: TaskStatus
}>()

const persistance = usePersistance()
const tasks = toRef(persistance, props.type)

const listRef = ref()
dragAndDrop({
  parent: listRef,
  values: tasks,
  group: 'tasks',
  dropZoneClass: "dragging",
  plugins: [animations()],
})
</script>

<template>
  <section class="w-xs min-w-0 flex flex-col">
    <div class="flex justify-between">
      <h2 class="text-gray-400 font-medium uppercase text-sm mb-4">
        {{ title }} {{ tasks.length }}
      </h2>
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

### The BoardView and router configuration

The `BoardView` component will contain all the columns and tasks of our kanban board. It's also the root view of our application and should be the component that is rendered when the user navigates to the root URL. Create the `BoardView.vue` file in the `src/views`. There is nothing special about this component, it's no different from any other component in our application, but; by convention views are placed in the `views` directory to differentiate them from other components.

```ts
<script setup lang="ts">
import { usePersistance } from '../persistance'
import { TaskStatus } from '../types'
import KColumn from '../components/KColumn.vue'
import KBtn from '../components/KBtn.vue'

const { reset } = usePersistance()
const columns = [
  { title: "Todo", type: TaskStatus.Todo },
  { title: "In progress", type: TaskStatus.InProgress },
  { title: "Done", type: TaskStatus.Done },
]
</script>

<template>
  <section class="flex flex-col flex-1 px-4">
    <article class="flex gap-4 flex-grow justify-center overflow-hidden">
      <KColumn v-for="column in columns" :key="column.title" :title="column.title" :type="column.type" />
    </article>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>

    <aside class="fixed bottom-6 right-6">
      <KBtn color="warning" @click="reset">Load initial state</KBtn>
    </aside>
  </section>
</template>
```

Ignore the `router-view` for now, we will get back to that in a moment. The `BoardView` component contains a list of `KColumn` components, one for each column on the board. It also contains a reset button that will load the initial tasks when clicked. Now we need to add the `BoardView` to the router configuration so that it is rendered when the user navigates to the root URL. To make this happen we need to add some configuration to the `routes` in `src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '../views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'board',
      component: BoardView,
    },
  ]
})

export default router
```

## Conclusion

Now when you navigate to the root URL of the application, the `BoardView` component will be rendered. And after clicking the **Load initial state** button, you should see the initial tasks in the columns and these should be draggable between the columns. In the next part of the tutorial, we will add the ability to create new tasks and edit existing ones.
