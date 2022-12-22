import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
  { path: "/", redirect: "/test" },
  { path: "/test", component: () => import("@/pages/Test.vue") },
  { path: "/A", component: () => import("@/pages/A.vue") },
  { path: "/B", component: () => import("@/pages/B.vue") },
  { path: "/C", component: () => import("@/pages/C.vue") },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router
