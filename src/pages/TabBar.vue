<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
const tabs = [
  { name: "标签1", hdl: () => router.push("/A") },
  {
    name: "标签2",
    hdl: () => router.push({ path: "/B", query: { num: Math.random() } }),
  },
  { name: "标签3", hdl: () => router.push("/C") },
  { name: "标签4", hdl: () => router.push("/D") },
]
</script>

<template>
  <div flex="~ col" class="w-screen h-screen">
    <div flex="~" class="h-50px items-center justify-around">
      <div @click="it.hdl()" v-for="it in tabs">
        <span>
          {{ it.name }}
        </span>
      </div>
    </div>
    <div class="grow">
      <router-view></router-view>
    </div>
  </div>
</template>
