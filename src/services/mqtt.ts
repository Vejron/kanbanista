import mqtt, { type MqttClient } from "mqtt"; // import namespace "mqtt"
import { ref, watch } from "vue";
import { tasks as initialTasks } from "./fake";
import type { ITask } from "@/types";
import { useDebounceFn } from "@vueuse/core";

let client: MqttClient
const topic = "totally_unique_id_123454321/board";
const tasks = ref<ITask[]>([]);

const debouncedUpdate = useDebounceFn(() => {
  // do something
  console.log('debouncedFn')
  if(client && client.connected) {
    client.publish(topic, JSON.stringify(tasks.value), { retain: true });
  }
}, 1000)

export function useMqtt(url?: string) {

  function update(tasks: ITask[]) {
    if(client && client.connected) {
      client.publish(topic, JSON.stringify(tasks), { retain: true });
    }
  }

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
    
    client.on("message", (topic, _message) => {
      // message is Buffer
      console.log('Received message:')

      try {
        const _tasks = JSON.parse(_message.toString());
        console.log(_tasks);
        tasks.value = _tasks;

      }
      catch (e) {
        console.error('Error parsing message, probably not valid JSON')
        // replace with fake initial tasks
        client.publish(topic, JSON.stringify(initialTasks), { retain: true });
      }

      //client.end();
    })
    
  }

  return {
    tasks,
    update,
    debouncedUpdate
  }
}
