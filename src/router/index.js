import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/Orders.vue"),
  },
  {
    path: "/line-check",
    name: "LineCheck",
    component: () => import("../views/LineCheck.vue"),
  },
  {
    path: "/monitor",
    name: "Monitor",
    component: () => import("../views/Monitor.vue"),
  },
  {
    path: "/grading",
    name: "Grading",
    component: () => import("../views/Grading.vue"),
  },
  {
    path: "/defects",
    name: "Defects",
    component: () => import("../views/Defects.vue"),
  },
  {
    path: "/board-finder",
    name: "BoardFinder",
    component: () => import("../views/BoardFinder.vue"),
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
  },
  {
    path: "/integrations",
    name: "Integrations",
    component: () => import("../views/Integrations.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
