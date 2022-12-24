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
import { type CSSProperties, ref, computed } from "vue"

const props = withDefaults(
  defineProps<{
    duration?: number
    dropEl?: HTMLElement | null
  }>(),
  {
    duration: 800,
  }
)

const emit = defineEmits<{
  (type: "start"): void
  (type: "move"): void
  (type: "end"): void
  (type: "dropover"): void
}>()

// 长按拖拽定时器
let timer: ReturnType<typeof setTimeout>
// 是否在拖拽中
const isDragging = ref(false)
// 拖拽元素
const el = ref<null | HTMLElement>(null)
// 拖拽的定位样式
const elStyle = ref<CSSProperties>({})
// 拖拽元素的宽高，用于校正定位? NOTE:这个期待更好的做法
const elRect = computed(() => {
  return {
    width: (el.value?.clientWidth || 0) / 2,
    height: (el.value?.clientHeight || 0) / 2,
  }
})

function clear() {
  if (timer) {
    clearTimeout(timer)
    timer = 0
  }
}

function drag(e: TouchEvent) {
  elStyle.value.left = `${e.changedTouches[0].clientX - elRect.value.width}px`
  elStyle.value.top = `${e.changedTouches[0].clientY - elRect.value.height}px`
}

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

function hdlStart(e: TouchEvent) {
  clear()
  timer = setTimeout(() => {
    emit("start")
    isDragging.value = true
    elStyle.value.position = "fixed"
    drag(e)
  }, props.duration)
}

function hdlEnd() {
  clear()
  if (props.dropEl && el.value) {
    const dropArea = getDropArea(
      props.dropEl.getBoundingClientRect(),
      el.value.getBoundingClientRect()
    )
    if (dropArea > 0.5) emit("dropover")
  }
  emit("end")
  isDragging.value = false
  elStyle.value.position = "static"
}

function hdlMove(e: TouchEvent) {
  if (!isDragging.value) return
  emit("move")
  clear()
  drag(e)
}
</script>
