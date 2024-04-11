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
    <h1 class="text-4xl font-bold text-center mb-4">
      Kanban Board
      <button @click="clear">clear</button>
    </h1>
    <article class="flex gap-4 flex-grow justify-center overflow-hidden">
      <Column v-for="column in columns" :key="column.title" :title="column.title" :type="column.type"></Column>
    </article>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>
