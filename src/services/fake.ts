import { type ITask, TaskStatus, type IUser } from '../types'

export const tasks: ITask[] = [
  {
    id: '1',
    created: deductDays(new Date(), 1).toISOString(),
    title: 'Setup development environment and scaffold the project',
    status: TaskStatus.Todo,
    priority: 1,
    summary: 'Clone the tutorial repository from GitHub and install the dependencies',
    description: `# Setup \n- Clone the tutorial repository from GitHub \n- Install the dependencies using npm or yarn \n- Run the development server using npm or yarn \n- Open the project in your browser and verify that it's running correctly`,
  },
  {
    id: '3',
    created: deductDays(new Date(), 2).toISOString(),
    title: 'Implement routing and navigation with vue-router',
    status: TaskStatus.InProgress,
    priority: 2,
    summary: 'Add a delete task feature to the task board UI',
    description: 'Add a delete task feature to the task board UI. The feature should allow users to delete tasks from the task board.',
  },
  {
    id: '2',
    created: deductDays(new Date(), 10).toISOString(),
    title: 'Styling the task board UI with Tailwind / UnoCSS ',
    status: TaskStatus.Done,
    priority: 3,
    summary: 'Implement the task board UI using Vue',
    description: 'Implement the task board UI using Vue. The UI should allow users to view tasks in different statuses, add new tasks, and update the status of tasks.',
  },
  {
    id: '4',
    created: deductDays(new Date(), 100).toISOString(),
    title: 'Implement a task detail view',
    status: TaskStatus.Todo,
    priority: 1,
    summary: 'Add a task detail view to the task board UI',
  }
]

export const tasksByType: Record<TaskStatus, ITask[]> = {
  [TaskStatus.Todo]: tasks.filter(task => task.status === TaskStatus.Todo),
  [TaskStatus.InProgress]: tasks.filter(task => task.status === TaskStatus.InProgress),
  [TaskStatus.Done]: tasks.filter(task => task.status === TaskStatus.Done),
}

export const users: IUser[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'John Smith' },
  { id: '4', name: 'Jane Smith' },
  { id: '5', name: 'John Johnson' },
  { id: '6', name: 'Jane Johnson' },
  { id: '7', name: 'John Brown' },
  { id: '8', name: 'Jane Brown' },
  { id: '9', name: 'John Davis' },
  { id: '10', name: 'Jane Davis' },
]

function deductDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}