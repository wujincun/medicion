import { createRouter, createWebHashHistory } from 'vue-router'
import Filter from '../views/Filter.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path:'/',
      redirect:'/filter'
    },
    {
      path: '/filter',
      name: 'filter',
      component: Filter
    },
    {
      path: '/add',
      name: 'add',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Add.vue')
    }
  ]
})

export default router
