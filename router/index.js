import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Orders from "../views/Orders.vue"
import LineCheck from "../views/LineCheck.vue"
import Monitor from "../views/Monitor.vue"
import Grading from "../views/Grading.vue"
import Defects from "../views/Defects.vue"
import BoardFinder from "../views/BoardFinder.vue"
import Users from "../views/Users.vue"
import Integrations from "../views/Integrations.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/batches",
    name: "Orders",
    component: Orders,
  },
  {
    path: "/line-check",
    name: "LineCheck",
    component: LineCheck,
  },
  {
    path: "/monitor",
    name: "Monitor",
    component: Monitor,
  },
  {
    path: "/grading",
    name: "Grading",
    component: Grading,
  },
  {
    path: "/defects",
    name: "Defects",
    component: Defects,
  },
  {
    path: "/board-finder",
    name: "BoardFinder",
    component: BoardFinder,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/integrations",
    name: "Integrations",
    component: Integrations,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
