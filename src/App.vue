<script setup lang="ts">
import { computed, CSSProperties, nextTick, onMounted, ref, watch } from "vue";

const containerRef = ref<null | HTMLDivElement>(null);
const scrollBarRef = ref<null | HTMLDivElement>(null);
const total = ref(300);
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
  containerRect.value.scrollHeight = containerRef.value?.scrollHeight ?? 0;
  containerRect.value.offsetHeight = containerRef.value?.offsetHeight ?? 0;
  containerRect.value.clientHeight = containerRef.value?.clientHeight ?? 0;
}

// 更新滑块高度
function updateScrollBarRectHeight() {
  sliderRect.value.clientHeight = scrollBarRef.value?.clientHeight ?? 0;
  sliderRect.value.offsetHeight = scrollBarRef.value?.offsetHeight ?? 0;
}

// 观察容器和滑块高度变化
const observer = new MutationObserver((mutationRecord) => {
  if (mutationRecord[0].type === "childList") updateContainerRectHeight();
  else if (mutationRecord[0].type === "attributes") updateScrollBarRectHeight();
});

// 滚动事件 (scrollTop)
function hdlScroll() {
  if (!containerRef.value) return;
  containerRect.value.scrollTop = containerRef.value.scrollTop;
  console.info("178me-debug:",containerRect.value)
}
let pressY = 0;

// 开始拖动
function hdlDown(e: any) {
  // pressY = e.y;
}

// 结束拖动
function hdlUp() {
  // pressY = 0;
}

// 监听拖动距离
function hdlMove(e: any) {
  // if (e.buttons === 0) return;
  // if (pressY === 0) return;
  // const { y } = e;
  // containerRef.value!.scrollTop += (y - pressY) * moveRatio.value;
  // // 当滚动进度为0和1不更新页面位置
  // if (scrollProgress.value === 1) return;
  // else if (scrollProgress.value === 0) return;
  // else pressY = y;
}

function hdlTouchStart(e: TouchEvent) {
  // console.info("178me-debug:", e.changedTouches[0].pageY);
  pressY = e.changedTouches[0].pageY;
}

function hdlTouchMove(e: TouchEvent) {
  const { pageY } = e.changedTouches[0];
  console.info("178me-debug:",pageY,pressY,moveRatio.value,containerRef.value?.scrollHeight)
  console.info("178me-debug:",(pageY - pressY) * moveRatio.value)
  containerRef.value!.scrollTop += (pageY - pressY) * moveRatio.value;
  console.info("178me-debug:",containerRef.value!.scrollTop)
  // console.info("178me-debug:",(pageY - pressY) * moveRatio.value)
  // 当滚动进度为0和1不更新页面位置
  if (scrollProgress.value === 1) return;
  else if (scrollProgress.value === 0) return;
  else pressY = pageY;
}

function hdlTouchEnd(e: TouchEvent) {
  console.info("178me-debug:触摸结束", e.changedTouches[0]);
  pressY = 0;
}

function modifyTotal(number: number) {
  total.value += number;
}

onMounted(() => {
  nextTick(() => {
    if (!containerRef.value) return;
    if (!scrollBarRef.value) return;
    updateContainerRectHeight();
    updateScrollBarRectHeight();
    observer.observe(containerRef.value, {
      childList: true,
    });
    observer.observe(scrollBarRef.value, {
      attributes: true,
    });
    window.addEventListener("mousemove", hdlMove);
    window.addEventListener("mouseup", hdlUp);
    window.addEventListener("touchmove", hdlTouchMove);
    window.addEventListener("touchend", hdlTouchEnd);
  });
});
</script>

<template>
  <div flex justify-center space-x-10px>
    <button @click="modifyTotal(10)">增加</button>
    <button @click="modifyTotal(-10)">减少</button>
  </div>
  <div class="relative select-none mx-0px">
    <div
      @touchstart="hdlTouchStart"
      @mousedown="hdlDown"
      ref="scrollBarRef"
      bg-blue
      h-50px
      w-20px
      class="absolute right-4px pointer-events-none1"
      :style="scrollPos"
    />
    <div
      @scroll="hdlScroll"
      ref="containerRef"
      h="500px"
      w="full"
      bg="gray"
      overflow="auto"
    >
      <div v-for="it in total" text-center pr-13px>
        <div h="50px">
          {{ it }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
