<template>
  <div>我是C页面{{ data.count }}</div>
  <button @click="router.push('/A')">下一页</button>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSharedData } from "./useData"
const data = useSharedData()
const router = useRouter()
// onMounted(() => {
//   console.info("178me-debug:C", data.count.value)
//   data.count.value = "C"
// })
</script>
