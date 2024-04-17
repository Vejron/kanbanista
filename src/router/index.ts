import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import TaskView from '../views/TaskView.vue'

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
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
