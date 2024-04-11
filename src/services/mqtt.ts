import mqtt, { type MqttClient } from "mqtt"; // import namespace "mqtt"
import { ref } from "vue";
import { tasksByType } from "./fake";
import { type ITask, TaskStatus } from "@/types";
import { useDebounceFn } from "@vueuse/core";

let client: MqttClient
const topic = "totally_unique_id_123454321/board";


const done = ref<ITask[]>([]);
const inProgress = ref<ITask[]>([]);
const todo = ref<ITask[]>([]);

const debouncedUpdate = useDebounceFn(() => {
  // do something
  console.log('debouncedFn')
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value,
  }
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true });
  }
}, 600)

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function updateAllNow() {
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value,
  }
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true });
  }
}

function update(tasks: ITask[]) {
  console.log('Updating tasks: ', tasks)
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true });
  }
}

function add(task: ITask) {
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value,
  }
  tasks[task.status].push({...task, id: uuid()});
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true });
  }
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
        
        // update reactive values
        todo.value = _tasks[TaskStatus.Todo]
        inProgress.value = _tasks[TaskStatus.InProgress]
        done.value = _tasks[TaskStatus.Done]
      }
      catch (e) {
        console.error('Error parsing message, probably not valid JSON')
        // replace with fake initial tasks
        client.publish(topic, JSON.stringify(tasksByType), { retain: true });
      }

      //client.end();
    })
    
  }

  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    todo,
    inProgress,
    done,
    taskById,
    add,
    update,
    updateAllNow,
    clear,
    debouncedUpdate
  }
}
