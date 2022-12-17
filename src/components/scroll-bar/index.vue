<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import { useScrollBar } from "./use/scrollBar"

const scrollContainer = ref<null | HTMLElement>(null)
const sliderRef = ref<null | HTMLElement>(null)
const containerEl = ref<null | HTMLElement>(null)
const autoHeight = false
const uScrollBar = useScrollBar({
  containerEl: containerEl,
  sliderEl: sliderRef,
  autoHeight,
})
const { sliderPos } = uScrollBar

onMounted(() => {
  nextTick(() => {
    if (!scrollContainer.value) return
    containerEl.value = scrollContainer.value.firstElementChild as HTMLElement
    uScrollBar.init()
  })
})

onUnmounted(() => {
  uScrollBar.modifySliderEventListener("remove")
})
</script>

<template>
  <div class="relative select-none mx-0px">
    <div
      ref="sliderRef"
      bg-blue
      h-50px
      w-20px
      class="absolute right-40px pointer-events-none1"
      :style="sliderPos" />
    <div ref="scrollContainer">
      <slot />
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
