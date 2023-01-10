<script lang="ts" setup>
import { ref } from "vue"
import Page from "@/layout/page/index.vue"
import ActionSheet from "@/components/ActionSheet.vue"
import Popup from "@/components/popup/index.vue"
import TipManage from "@/components/tip"
import Overlay from "@/components/overlay"
const show = ref(false)
const tip = TipManage()

function hdlTest() {
  show.value = true
  // tip.present("hihi", { message: "111111111" })
}
</script>

<template>
  <Page flex="~ col" items-center title="测试Popup">
    <Overlay />
    <button @click="hdlTest()" mt-30 text="30px" select-none>open</button>
    <div class="bgR p-[20px]">
      <div>111</div>
    </div>
    <Popup v-model:visiable="show"></Popup>
  </Page>
</template>

<style scoped>
.bgR div{
  background: red;
}
.bgR{
  background: blue;
}
</style>
