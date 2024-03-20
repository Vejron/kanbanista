import mqtt, { type MqttClient } from "mqtt"; // import namespace "mqtt"
import { ref, watch } from "vue";
import { tasks as initialTasks } from "./fake";
import type { ITask } from "@/types";

let client: MqttClient
const topic = "totally_unique_id_123454321/board";

const tasks = ref<ITask[]>([]);

function isTaskDeepEqual(a: ITask | undefined, b: ITask| undefined) {
  return a?.id === b?.id && a?.title === b?.title && a?.description === b?.description
}

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
      console.log(_message.toString());

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

      watch(tasks, (newTasks, oldTasks) => {
        //console.log('Tasks updated, publishing to MQTT');
        // check if any task is not equal
        if (!newTasks.every((task, index) => isTaskDeepEqual(task, oldTasks[index]))) {
          console.log('Tasks are not equal, updating MQTT');
          //update(newTasks);
        }

        //update(newTasks);
      }, { deep: true })
    })
  }

  return {
    tasks,
    update,
  }
}
