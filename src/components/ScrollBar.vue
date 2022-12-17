<script setup lang="ts">
import { isMobile } from "@/utils";
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  type CSSProperties,
} from "vue";

const scrollContainer = ref<null | HTMLDivElement>(null);
let containerEl: null | HTMLDivElement = null;
const sliderRef = ref<null | HTMLDivElement>(null);
const autoHeight = false;

const containerRect = ref({
  scrollTop: 0,
  scrollHeight: 0,
  offsetHeight: 0,
  clientHeight: 0,
});
const sliderRect = ref({
  offsetHeight: 0,
  clientHeight: 0,
});
// 滚动进度
const scrollProgress = computed(() => {
  return (
    containerRect.value.scrollTop /
    (containerRect.value.scrollHeight - containerRect.value.clientHeight)
  );
});
// 可滚动高度
const rollableHeight = computed(() => {
  return containerRect.value.clientHeight - sliderRect.value.clientHeight;
});
// 滚动条滑块高度比
const sliderRatio = computed(() => {
  return containerRect.value.clientHeight / containerRect.value.scrollHeight;
});
const scrollPos = computed<CSSProperties>(() => {
  // console.info("178me-debug:progress", scrollProgress.value);
  // console.info("178me-debug:rollable", rollableHeight.value);
  // console.info("178me-debug:ratio", sliderRatio.value);
  // console.info("178me-debug:containerRect", containerRect.value);
  // console.info("178me-debug:scrollRect", sliderRect.value);
  return {
    top: `${scrollProgress.value * rollableHeight.value}px`,
    height: autoHeight ? `${sliderRatio.value * 100}%` : undefined,
  };
});
// 滑块区域与内容区域的比例
const moveRatio = computed(() => {
  return (
    (containerRect.value.scrollHeight - containerRect.value.clientHeight) /
    rollableHeight.value
  );
});

// 更新容器高度
function updateContainerRectHeight() {
  containerRect.value.scrollHeight = containerEl?.scrollHeight ?? 0;
  containerRect.value.offsetHeight = containerEl?.offsetHeight ?? 0;
  containerRect.value.clientHeight = containerEl?.clientHeight ?? 0;
}

// 更新滑块高度
function updateScrollBarRectHeight() {
  sliderRect.value.clientHeight = sliderRef.value?.clientHeight ?? 0;
  sliderRect.value.offsetHeight = sliderRef.value?.offsetHeight ?? 0;
}

// 观察容器和滑块高度变化
const observer = new MutationObserver((mutationRecord) => {
  if (mutationRecord[0].type === "childList") updateContainerRectHeight();
  else if (mutationRecord[0].type === "attributes") updateScrollBarRectHeight();
});

// 滚动事件 (scrollTop)
function hdlScroll() {
  if (!containerEl) return;
  containerRect.value.scrollTop = containerEl.scrollTop;
}
let pressY = 0;

// 开始拖动
function hdlMouseDown(e: any) {
  pressY = e.y;
}

// 结束拖动
function hdlMouseUp() {
  pressY = 0;
}

// 监听拖动距离
function hdlMouseMove(e: any) {
  if (e.buttons === 0) return;
  if (pressY === 0) return;
  const { y } = e;
  containerEl!.scrollTop += (y - pressY) * moveRatio.value;
  // 当滚动进度为0和1不更新页面位置
  if (scrollProgress.value === 1) return;
  else if (scrollProgress.value === 0) return;
  else pressY = y;
}

function hdlTouchStart(e: TouchEvent) {
  pressY = e.changedTouches[0].pageY;
}

function hdlTouchMove(e: TouchEvent) {
  e.stopPropagation();
  const { pageY } = e.changedTouches[0];
  containerEl!.scrollTop += (pageY - pressY) * moveRatio.value;
  // 当滚动进度为0和1不更新页面位置
  if (scrollProgress.value === 1) return;
  else if (scrollProgress.value === 0) return;
  else pressY = pageY;
}

function hdlTouchEnd() {
  pressY = 0;
}

onMounted(() => {
  nextTick(() => {
    if (!sliderRef.value) return;
    if (!scrollContainer.value) return;
    containerEl = scrollContainer.value.firstElementChild as HTMLDivElement;
    containerEl.addEventListener("scroll", hdlScroll);
    updateContainerRectHeight();
    updateScrollBarRectHeight();
    observer.observe(containerEl!, {
      childList: true,
    });
    observer.observe(sliderRef.value, {
      attributes: true,
    });
    if (isMobile()) {
      sliderRef.value.addEventListener("touchstart", hdlTouchStart);
      sliderRef.value.addEventListener("touchmove", hdlTouchMove);
      sliderRef.value.addEventListener("touchend", hdlTouchEnd);
    } else {
      sliderRef.value.addEventListener("mousedown", hdlMouseDown);
      window.addEventListener("mousemove", hdlMouseMove);
      window.addEventListener("mouseup", hdlMouseUp);
    }
  });
});

onUnmounted(() => {
  if (isMobile()) {
    sliderRef.value?.removeEventListener("touchstart", hdlTouchStart);
    sliderRef.value?.removeEventListener("touchmove", hdlTouchMove);
    sliderRef.value?.removeEventListener("touchend", hdlTouchEnd);
  } else {
    sliderRef.value?.removeEventListener("mousedown", hdlMouseDown);
    window.removeEventListener("mousemove", hdlMouseMove);
    window.removeEventListener("mouseup", hdlMouseUp);
  }
});
</script>

<template>
  <div class="relative select-none mx-0px">
    <div
      ref="sliderRef"
      bg-blue
      h-50px
      w-20px
      class="absolute right-40px pointer-events-none1"
      :style="scrollPos"
    />
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
