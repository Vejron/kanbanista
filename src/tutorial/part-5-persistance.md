# Persistance

In this part we will add persistance to our application. At first we will use the browser's local storage to store the tasks. Later we will switch to a more advanced solution using a real backend.

## Local storage

Local storage is a simple key-value store that is available in all browser. It is am easy way to persist data in a small application like ours. In our case it's as simple as using useLocalStorage from `@vueuse/core`. Modify the task creation in `src/persistance.ts` file to look like this:

```ts
import { useLocalStorage } from "@vueuse/core"

const done = useLocalStorage<ITask[]>('done-key', []);
const inProgress = useLocalStorage<ITask[]>('in-progress-key', []);
const todo = useLocalStorage<ITask[]>('todo-key', []);
```

That's it! Now the tasks will be stored in the local storage and will be available after the page reloads.

## A 'real' backend

Local storage is great for small applications, but it has some limitations. For example, it's not shared between different devices. To make our application multiplayer we need a real backend. There are many ways to implement a backend, but doing so is out of scope for this tutorial. Instead we will use a simple backend that is already there. We will use the free MQTT broker at `broker.emqx.io`. To connect to the broker we will use the `mqtt` library which should already be installed as a dependency. Modify the `src/persistance.ts` file to look like this:

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

There is a couple of notable changes here. We are using the `mqtt` library to connect to the broker. We are also using the `useMousePressed` function from `@vueuse/core` to avoid updating the tasks while dragging them. The `update` function is used to send the tasks to the broker. The `reset` function is used to send the initial tasks to the broker. The `taskById` function is used to get a task by its id. The `skip` ref is used to avoid updating the tasks while dragging them. The `client` is used to connect to the broker. The `topic` is the topic we are subscribing to. The `url` is the url of the broker.
