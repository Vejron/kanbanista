import mqtt, { type MqttClient } from "mqtt";
import { ref } from "vue";
import { tasksByType } from "./fake";
import { type ITask, TaskStatus } from "@/types";
import { watchDebounced, useMousePressed } from "@vueuse/core";

let client: MqttClient
const topic = "totally_unique_id_123454321/board";

const { pressed } = useMousePressed()
const skip = ref(false);
const done = ref<ITask[]>([]);
const inProgress = ref<ITask[]>([]);
const todo = ref<ITask[]>([]);

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function update() {
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value,
  }
  if(client && client.connected) {
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
  tasks[task.status].value.push({...task, id: uuid()});
}

function clear() {
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasksByType), { retain: true });
  }
}

function taskById(id: string) {
  return [...todo.value, ...inProgress.value, ...done.value].find(task => task.id === id)
}

export function useMqtt(url?: string) {

  if (!client && url) {
    //watch all tasks and update mqtt
    watchDebounced([todo, inProgress, done], () => {
      // only update if mouse is not pressed this is to avoid updating while dragging
      if(!pressed.value) {
        update()
      }
    }, { debounce: 500, deep: true })

    client = mqtt.connect(url);

    client.on("connect", () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log('Subscribed to topic:', topic);
          //client.publish(topic, JSON.stringify(initialTasks), { retain: true });
        }
      })
    })
    
    client.on("message", (topic, buffer) => {
      try {
        const _tasks = JSON.parse(buffer.toString());
        console.log('Received tasks: ', _tasks)
        
        // update reactive values only if they are different
        if(JSON.stringify(_tasks[TaskStatus.Todo]) !== JSON.stringify(todo.value)) {
          todo.value = _tasks[TaskStatus.Todo]
        }
        if(JSON.stringify(_tasks[TaskStatus.InProgress]) !== JSON.stringify(inProgress.value)) {
          inProgress.value = _tasks[TaskStatus.InProgress]
        }
        if(JSON.stringify(_tasks[TaskStatus.Done]) !== JSON.stringify(done.value)) {
          done.value = _tasks[TaskStatus.Done]
        }
      }
      catch (e) {
        console.error('Error parsing message, probably not valid JSON')
        // replace with fake initial tasks
        client.publish(topic, JSON.stringify(tasksByType), { retain: true });
      }
    })
    
  }

  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    skip,
    taskById,
    add,
    remove,
    update,
    clear,
  }
}
