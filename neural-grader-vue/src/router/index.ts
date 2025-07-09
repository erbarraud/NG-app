import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/batches',
      name: 'batches',
      component: () => import('../views/BatchesView.vue')
    },
    {
      path: '/board-finder',
      name: 'board-finder',
      component: () => import('../views/BoardFinderView.vue')
    },
    {
      path: '/line-check',
      name: 'line-check',
      component: () => import('../views/LineCheckView.vue')
    },
    {
      path: '/tools/claims',
      name: 'claims',
      component: () => import('../views/tools/ClaimsView.vue')
    },
    {
      path: '/tools/shift-scheduler',
      name: 'shift-scheduler',
      component: () => import('../views/tools/ShiftSchedulerView.vue')
    },
    {
      path: '/grading',
      name: 'grading',
      component: () => import('../views/GradingView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

export default router