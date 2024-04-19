# Create, update, and delete

Now that we have something basic that kind of works, let's add the ability to **create**, **update**, and **delete** tasks.

## The TaskView

Let's add a new view to our application. This view will be responsible for creating, updating, and deleting tasks. We'll call it `TaskView`. We'll also add a new route to our application that will point to this view. Create a file called `TaskView.vue` in the `src/views` directory and fill it with the following content:

```ts
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { usePersistance } from '../persistance'
import { type ITask, TaskStatus } from "../types"
import KMarkdown from '@/components/KMarkdown.vue'
import KBtn from '@/components/KBtn.vue'

const props = defineProps<{
  type?: TaskStatus
  taskId?: string
}>()

// are we editing an existing task or creating a new one?
const isEditMode = computed(() => !!props.taskId)

// close the modal when clicking outside of it
const router = useRouter()
const target = ref<HTMLElement>()
onClickOutside(target, () => router.push({ name: 'board' }))


const { taskById, add, remove } = usePersistance()

const task = computed(() => isEditMode.value ? taskById(props.taskId as string) : newTask.value)

const newTask = ref<ITask>({
  title: '',
  description: '',
  id: '',
  priority: 0,
  status: TaskStatus.Todo,
  created: new Date().toISOString(),
})

const priorityOptions = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Very high' },
]

// remove the task and navigate back to the board
function deleteTask(task: ITask) {
  remove(task)
  router.push({ name: 'board' })
}

function addTask(task: ITask) {
  // add the task and modify the status to the current column and created date to now
  add({ ...task, status: props.type as TaskStatus, created: new Date().toISOString() })
  // then close the "modal" by navigating back to the board
  router.push({ name: 'board' })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 grid place-content-center">
    <div class="w-screen px-4 max-w-3xl">
      <div v-if="task" ref="target"
        class="bg-slate-900/50 backdrop-blur-sm text-gray-300 rounded-xl border border-gray-700 px-6 pt-4">
        <h2 class="text-3xl font-bold mb-4">{{ isEditMode ? 'Edit task' : 'Add task' }}</h2>

        <div class="grid grid-cols-20 gap-4 mb-5">

          <div class="col-span-13">
            <label class="text-gray-400 block text-sm font-semibold mb-2" for="id-title">Title</label>
            <input class="text-field focus:ring-purple focus:ring-2" v-model="task.title" type="text" id="id-title">
          </div>

          <div class="col-span-7">
            <label class="text-gray-400 flex justify-end text-sm font-semibold mb-2" for="id-priority">Priority</label>
            <select id="id-priority" class="text-field focus:ring-purple focus:ring-2" v-model="task.priority">
              <option class="b-slate-800" disabled>Please select one</option>
              <option class="bg-slate-800 py-2 leading-19" v-for="option in priorityOptions" :key="option.value"
                :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <label class="text-gray-400 flex justify-between text-sm font-semibold mb-2" for="id-description">
          Description <span>Markdown preview</span>
        </label>
        <div
          class="relative border border-gray-400 focus-within:ring-purple focus-within:ring-2 overflow-hidden w-full h-[40vh] grid grid-cols-20 rounded-lg">
          <textarea class="text-field border-none !h-[40vh] !rounded-none resize-none col-span-15"
            v-model="task.description" id="id-description" />
          <KMarkdown
            class="p-4 h-[40vh] text-[.5em] overflow-auto col-span-5 bg-transparent border-l-2 border-slate-700"
            :md="task.description" />
        </div>

        <div class="flex justify-end gap-4 py-6">
          <KBtn v-if="isEditMode" icon="mdi:trash-can" @click="deleteTask(task)">
            Delete
          </KBtn>
          <KBtn v-else icon="mdi:check" @click="addTask(task)">
            Add task
          </KBtn>
          <KBtn color="warning" icon="mdi:close" @click="router.push({ name: 'board' })">
            Close
          </KBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.text-field {
  @apply font-mono h-12 border border-gray-400 outline-none rounded-lg block w-full px-4 py-3 bg-transparent placeholder-gray-400 text-gray-200;
}
</style>
```

We will also need to add some new routes to our application. Open the `src/router/index.ts` file and add two new routes (*one for create and one for edit*) to the `routes` array. also add the `TaskView` import at the top of the file. Like this `import TaskView from '../views/TaskView.vue'`

```ts
routes: [
    {
      path: '/',
      name: 'board',
      component: BoardView,
      children: [
        {
          path: 'create/:type',
          props: true,
          name: 'create-task',
          component: TaskView
        },
        {
          path: 'edit/:taskId',
          props: true,
          name: 'edit-task',
          component: TaskView
        },
      ]
    },
  ]
```

## Create a new task

Now that we have the `TaskView` in place, let's add a button to the `KColumn` component that will open the `TaskView` in create mode. Open the `src/components/KColumn.vue` and modify it to include a button that will open the `TaskView` in create mode by navigation to the correct route:

```ts
<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { TaskStatus } from '../types'
import { dragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations } from "@formkit/drag-and-drop"
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

Now when clicking the button tiny + button, the `TaskView` will open in create mode. We will add the ability to edit an existing task in the next section.

## Edit an existing task

To edit an existing task, we need a way to open the `TaskView` in edit mode. We will achieve this by by replacing the second `<div>` with a `RouterLink` in our `KTask` component. Open the `src/components/KTask.vue` file and modify it as follows:

```html
<div class="block w-full group">
  <!-- Content removed for clarity -->
</div>

```

Should be replaced with:

```html
<RouterLink class="block w-full group" :to="{ name: 'edit-task', params: { taskId: task.id } }">
  <!-- Content removed for clarity -->
</RouterLink>
```

This should make each task in a column clickable. When clicked, the `TaskView` will open in edit mode for that specific task. Notice that we are passing the `taskId` as a parameter to the route to let the `TaskView` know which task to edit. Try editing a task and see if it works. When opening in edit mode the `TaskView` also renders a delete button that will remove the task from the list.

![styling](/images/edit.webp)

## Conclusion

We have added the ability to create, update, and delete tasks in our application. In the next section, we will modify the persistance layer to use the browser's local storage to persist the tasks between reloads and then finally make it **multiplayer** by adding a "real" backend.
