<template>
  <div
    ref="el"
    @touchstart="hdlStart"
    @touchmove="hdlMove"
    @touchend="hdlEnd"
    @touchcancel="hdlEnd"
    :style="elStyle">
    <slot :isDragging="isDragging" />
  </div>
</template>
<script setup lang="ts">
import { type CSSProperties, ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    duration?: number
    dropEl?: HTMLElement | null
  }>(),
  {
    duration: 500,
  }
)

const emit = defineEmits<{
  (type: "start"): void
  (type: "move"): void
  (type: "end"): void
  (type: "dropenter"): void
  (type: "dropleave"): void
  (type: "dropover"): void
}>()

// 长按拖拽定时器
let timer: ReturnType<typeof setTimeout> | undefined
// 是否在拖拽中
const isDragging = ref(false)
// 是否进入拖放区
const isEnterDrop = ref(false)
// 拖拽元素
const el = ref<null | HTMLElement>(null)
// 拖拽的定位样式
const elStyle = ref<CSSProperties>({})
// 开始触摸点
const startTouchOffset = ref({ x: 0, y: 0 })
const startPoint = ref({
  top: "0px",
  left: "0px",
})

function clear() {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

function drag(e: TouchEvent) {
  elStyle.value.left = `${
    e.changedTouches[0].clientX - startTouchOffset.value.x
  }px`
  elStyle.value.top = `${
    e.changedTouches[0].clientY - startTouchOffset.value.y
  }px`
}

function vibrate(pattern: number | number[]) {
  if ("vibrate" in window.navigator) window.navigator.vibrate(pattern)
}

// 计算元素与拖放区域的相交面积
function getDropArea(parentRect: DOMRect, childRect: DOMRect) {
  const cl = childRect.right - parentRect.left
  const cr = parentRect.right - childRect.left
  const ct = childRect.bottom - parentRect.top
  const cb = parentRect.bottom - childRect.top
  if (Math.min(cl, cr, ct, cb) < 0) return 0
  const excessWidth = Math.min(cl, cr, childRect.width)
  const excessHeight = Math.min(ct, cb, childRect.height)
  return (excessWidth * excessHeight) / (childRect.width * childRect.height)
}

function isEnter() {
  if (props.dropEl && el.value) {
    const dropArea = getDropArea(
      props.dropEl.getBoundingClientRect(),
      el.value.getBoundingClientRect()
    )
    if (dropArea > 0.5) {
      isEnterDrop.value = true
      return
    }
  }
  isEnterDrop.value = false
}

function hdlStart(e: TouchEvent) {
  clear()
  timer = setTimeout(() => {
    emit("start")
    vibrate(50)
    isDragging.value = true
    const staticRect = el.value!.getBoundingClientRect()
    el.value!.classList.add("dragging")
    elStyle.value.width = `${staticRect.width}px`
    elStyle.value.height = `${staticRect.height}px`
    startPoint.value.left = `${staticRect.left}px`
    startPoint.value.top = `${staticRect.top}px`
    startTouchOffset.value.x = e.changedTouches[0].clientX - staticRect.left
    startTouchOffset.value.y = e.changedTouches[0].clientY - staticRect.top
    drag(e)
  }, props.duration)
}

function hdlEnd() {
  clear()
  isEnter()
  if (isEnterDrop.value) emit("dropover")
  emit("end")
  if (startPoint.value.left !== "0px") {
    el.value!.classList.add("dragend")
    elStyle.value.left = startPoint.value.left
    elStyle.value.top = startPoint.value.top
  }
  setTimeout(() => {
    isDragging.value = false
    el.value!.classList.remove("dragging")
    el.value!.classList.remove("dragend")
    startPoint.value.left = "0px"
    startPoint.value.top = "0px"
  }, 300)
}

function hdlMove(e: TouchEvent) {
  clear()
  if (!isDragging.value) return
  isEnter()
  emit("move")
  drag(e)
}

watch(isEnterDrop, (nVal) => {
  if (nVal) emit("dropenter")
  else emit("dropleave")
})
</script>

<style scoped>
.dragging {
  position: fixed;
  z-index: 999;
}
.dragend {
  transition: all 0.3s;
}
</style>
