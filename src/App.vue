<script setup lang="ts">
import { computed, CSSProperties, nextTick, ref, watch } from "vue";

const containerRef = ref<null | HTMLDivElement>(null);
const scrollBarRef = ref<null | HTMLDivElement>(null);
const total = ref(20);

const containerRect = ref({
  scrollTop: 0,
  scrollHeight: 0,
  offsetHeight: 0,
  clientHeight: 0,
});
const scrollPos = computed<CSSProperties>(() => {
  return {
    top: `${
      (containerRect.value.scrollTop /
        (containerRect.value.scrollHeight -
          containerRect.value?.clientHeight)) *
      450
    }px`,
    // height: containerRef.value?.clientHeight
    //   ? `${
    //       (containerRef.value?.clientHeight / scrollRect.value.scrollHeight) *
    //       100
    //     }%`
    //   : "0%",
  };
});
// 滚动条移动1像素等于scrollTop的多少倍
const ratio = computed(() => {
  return (
    (containerRect.value.scrollHeight - containerRef.value!.offsetHeight) /
    (containerRef.value!.offsetHeight - scrollBarRef.value!.offsetHeight)
  );
});

function updateContainerRectHeight() {
  containerRect.value.scrollHeight = containerRef.value?.scrollHeight ?? 0;
  containerRect.value.offsetHeight = containerRef.value?.offsetHeight ?? 0;
  containerRect.value.clientHeight = containerRef.value?.clientHeight ?? 0;
}

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(() => {
  updateContainerRectHeight()
  console.info("178me-debug:", containerRect.value);
});

function hdlScroll() {
  if (!containerRef.value) return;
  containerRect.value.scrollTop = containerRef.value.scrollTop;
}
let pressY = 0;

function hdlDown(e: MouseEvent) {
  pressY = e.y;
}

function hdlUp() {
  pressY = 0;
}

function hdlMove(e: MouseEvent) {
  if (e.buttons === 0) return;
  if (pressY === 0) return;
  const { y } = e;
  console.info("178me-debug:", ratio.value);
  containerRef.value!.scrollTop += (y - pressY) * ratio.value;
  pressY = y;
}

watch(containerRect, () => {
  console.info("178me-debug:", containerRect.value);
});

nextTick(() => {
  if (!containerRef.value) return;
  updateContainerRectHeight()
  observer.observe(containerRef.value, {
    childList: true,
  });
  window.addEventListener("mousemove", hdlMove);
  window.addEventListener("mouseup", hdlUp);
});
function modifyTotal(number: number) {
  total.value += number;
}
</script>

<template>
  <div flex justify-center space-x-10px>
    <button @click="modifyTotal(10)">增加</button>
    <button @click="modifyTotal(-10)">减少</button>
  </div>
  <div class="relative select-none mx-100px">
    <div
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
      <div v-for="it in total" text-right pr-13px>
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
