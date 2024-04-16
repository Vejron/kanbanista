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

export interface IUser {
  id: string
  name: string
}