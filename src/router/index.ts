import { ref, watch } from "vue"
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router"
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/B",
    component: () => import("@/pages/TabBar.vue"),
    children: [
      { path: "A", component: () => import("@/pages/A.vue") },
      { path: "B", component: () => import("@/pages/B.vue") },
      { path: "C", component: () => import("@/pages/C.vue") },
      { path: "D", component: () => import("@/pages/C.vue") },
    ],
  },
  { path: "/test", component: () => import("@/pages/Test.vue") },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

const lastPosition = ref(0)
const isOnly = ref(true)

watch(router.currentRoute, () => {
  lastPosition.value = window.history.state.position
})

function isForward() {
  return window.history.state.position >= lastPosition.value
}

function firstAddState(path: string) {
  setTimeout(() => {
    router.push({ path: path, query: { "lzc-first": 0 } })
    setTimeout(() => {
      router.push({ path: path, query: {} })
    }, 100)
  }, 100)
}

router.beforeEach((to, _, next) => {
  if (["/A", "/B", "/C", "D"].includes(to.path)) {
    if (!isForward()) return next(false)
  }
  next(true)
  console.info("178me-debug:",to,window.history.length)
  if (isOnly.value && window.history.length === 1) {
    firstAddState(to.path)
    isOnly.value = false
  }
})

export default router
