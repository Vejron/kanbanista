<script setup lang="ts">
import { useMqtt } from '../services/mqtt'
import { TaskStatus } from '../types'
import Column from '@/components/Column.vue'

const { clear } = useMqtt("wss://test.mosquitto.org:8081/mqtt")
const columns = [
  { title: "Todo", type: TaskStatus.Todo },
  { title: "In progress", type: TaskStatus.InProgress },
  { title: "Done", type: TaskStatus.Done },
]
</script>

<template>
  <section class="flex flex-col flex-1 px-4">
    <article class="flex gap-4 flex-grow justify-center overflow-hidden">
      <Column v-for="column in columns" :key="column.title" :title="column.title" :type="column.type"></Column>
    </article>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
    
    <RouterLink to="/about" class="fixed bottom-6 left-6 bg-purple-700 hover:bg-purple-500 hover:text-black text-white transition-colors duration-300 font-semibold text-xs h-16 w-16 shadow-lg shadow-inset shadow-purple rounded-full grid place-content-center">
      ABOUT
    </RouterLink>
    <button class="fixed bottom-6 right-6 bg-orange-500 hover:bg-purple-700 hover:text-white text-black transition-colors duration-300 font-semibold text-xs h-16 w-16 shadow-lg shadow-inset shadow-orange-800 rounded-full" @click="clear">RESET</button>
  </section>
</template>
