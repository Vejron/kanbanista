import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import TaskView from '../views/TaskView.vue'

import Setup from '@/tutorial/setup.md'
import Part2 from '@/tutorial/part-2.md'
import Part3 from '@/tutorial/part-3.md'
import Part4 from '@/tutorial/part-4-crud.md'
import Part5 from '@/tutorial/part-5-persistance.md'
import Part6 from '@/tutorial/part-6-deploy.md'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'board',
      props: true,
      component: BoardView,
      children: [
        {
          path: 'create/:type',
          props: true,
          name: 'create-task',
          component: TaskView
        },
        {
          path: 'edit/:taskId',
          props: true,
          name: 'task',
          component: TaskView
        },
      ]
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      children: [
        {
          path: '',
          name: 'setup',
          component: Setup
        },
        {
          path: 'part-2',
          name: 'part-2',
          component: Part2
        },
        {
          path: 'part-3',
          name: 'part-3',
          component: Part3
        },
        {
          path: 'part-4',
          name: 'part-4',
          component: Part4
        },
        {
          path: 'part-5',
          name: 'part-5',
          component: Part5
        },
        {
          path: 'part-6',
          name: 'part-6',
          component: Part6
        }
      ]
    }
  ]
})

export default router
