<template>
  <div flex="~ col" w-screen h="screen">
    <span text="center 25px">测试拖拽</span>
    <div bg-red w-full h-100px>拖动到这儿</div>
    <div class="overflow-hidden" grid="~ cols-3 gap-10px">
      <div
        @pointerdown="hdlDown"
        @pointermove="hdlMove"
        @pointerup="hdlUp"
        style="touch-action: none"
        v-for="i in 30"
        flex="~ col"
        items-center>
        <div h-100px w-100px bg-blue-500 />
        <span only="text-15px">{{ i }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSharedData } from "./useData"
import { useDraggable } from "@vueuse/core"

const isDragging = ref(false)
const dragEl = ref<null | HTMLElement>(null)
const startStyle = ref({ left: 0, top: 0, touchAction: "", position: "" })
// const { x, y, position } = useDraggable(dragEl)

function hdlDown(e: PointerEvent) {
  console.info("178me-debug:",e)
  isDragging.value = true
  dragEl.value = e.target
  startStyle.value.left = e.offsetX
  startStyle.value.top = e.offsetY
  startStyle.value.position = dragEl.value?.style.position || ""
  dragEl.value.style.position = "fixed"
  dragEl.value.style.touchAction = "none"
  dragEl.value.style.left = `${e.clientX - 50}px`
  dragEl.value.style.top = `${e.clientY - 50}px`
  console.info("178me-debug:down", e.offsetX, e.offsetY)
}
function hdlUp(e: PointerEvent) {
  isDragging.value = false
  dragEl.value.style.top = startStyle.value.top
  dragEl.value.style.left = startStyle.value.left
  dragEl.value.style.position = startStyle.value.position
  dragEl.value = null
  console.info("178me-debug:up", e.offsetX, e.offsetY)
}

function hdlMove(e: PointerEvent) {
  if (!isDragging.value) return
  if (!dragEl.value) return
  dragEl.value.style.left = `${e.clientX - 50}px`
  dragEl.value.style.top = `${e.clientY - 50}px`
  console.info("178me-debug:", e.clientX, e.clientY)
}

// window.addEventListener("pointerdown", hdlDown)
// window.addEventListener("pointermove", hdlMove)
// window.addEventListener("pointerup", hdlUp)
</script>
