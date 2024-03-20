import { type ITask, TaskStatus, type IUser } from '../types'

export const tasks: ITask[] = [
  {
    id: '1',
    created: '2021-08-01T12:00:00Z',
    title: 'Setup',
    status: TaskStatus.Todo,
    summary: 'Clone the tutorial repository from GitHub and install the dependencies',
    description: `# Setup \n- Clone the tutorial repository from GitHub \n- Install the dependencies using npm or yarn \n- Run the development server using npm or yarn \n- Open the project in your browser and verify that it's running correctly`,
  },
  {
    id: '2',
    created: '2024-01-01T12:00:00Z',
    title: 'Implement task board UI',
    status: TaskStatus.Todo,
    summary: 'Implement the task board UI using Vue',
    description: 'Implement the task board UI using Vue. The UI should allow users to view tasks in different statuses, add new tasks, and update the status of tasks.',
  },
  {
    id: '3',
    created: '2024-02-01T12:00:00Z',
    title: 'Add a delete task feature',
    status: TaskStatus.InProgress,
    summary: 'Add a delete task feature to the task board UI',
    description: 'Add a delete task feature to the task board UI. The feature should allow users to delete tasks from the task board.',
  },
]

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