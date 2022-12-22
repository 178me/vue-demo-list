<template>
  <div>我是B页面{{ data.count }}</div>
  <button @click="router.push('/C')">下一页</button>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSharedData } from "./useData"
const data = useSharedData()
const router = useRouter()
// onMounted(() => {
//   console.info("178me-debug:B", data.count.value)
//   data.count.value = "B"
// })
</script>
