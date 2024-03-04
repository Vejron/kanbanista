import { type ITask } from '../types'
import { tasks } from './fake'

export async function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchTasks(boardId: string) {
  await delay()
  return tasks
}

export async function getTask(id: string) {
  await delay()
  return tasks.find(task => task.id === id)
}

export async function updateTask(id: string, updates: Partial<ITask>) {
  await delay()
  const task = tasks.find(task => task.id === id)
  if (task) {
    Object.assign(task, updates)
  }
  return task
}