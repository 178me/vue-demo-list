<script lang="ts" setup>
import { ref } from "vue"
import Page from "@/layout/page/index.vue"
import ActionSheet from "@/components/ActionSheet.vue"
import TipManage from "@/components/tip"
const show = ref(false)
const tip = TipManage()

function hdlTest() {
  show.value = true
  tip.present("hihi", { message: "111111111" })
}
</script>

<template>
  <Page flex="~ col" items-center title="测试Popup">
    <button @click="hdlTest()" mt-30 text="30px" select-none>open</button>
    <ActionSheet v-model:visiable="show">1111111111</ActionSheet>
  </Page>
</template>
