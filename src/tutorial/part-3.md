# The board view

When using any component based framework, it is important to break down the UI into smaller components. This makes the code DRY:er and more maintainable. In this part of the tutorial, we will create a `BoardView` component that will contain all the `Coloumn`-s and `Task`-s of our kanban board.

## Typescript definitions and a simple backend

Before we start building the `BoardView` component, let's define some types and create a simple backend to store the data. Create a `types.ts` file in the `src` directory with the following content:

```ts
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
```

