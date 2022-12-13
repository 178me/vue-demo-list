<script setup lang="ts">
import { computed, CSSProperties, nextTick, ref, watch } from "vue";

const containerRef = ref<null | HTMLDivElement>(null);
const scrollBarRef = ref<null | HTMLDivElement>(null);
const total = ref(20);

const scrollRect = ref({
  scrollTop: 0,
  scrollHeight: 0,
});
const scrollPos = computed<CSSProperties>(() => {
  return {
    top: `${
      (scrollRect.value.scrollTop /
        (scrollRect.value.scrollHeight - containerRef.value?.clientHeight)) *
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
const ratio = computed(() => {
  return (
    (scrollRect.value.scrollHeight - containerRef.value!.offsetHeight) /
    (containerRef.value!.offsetHeight - scrollBarRef.value!.offsetHeight)
  );
});

function modifyTotal(number: number) {
  total.value += number;
}

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver((mutationsList, observer) => {
  console.info("178me-debug:", mutationsList, observer);
  scrollRect.value.scrollHeight = containerRef.value?.scrollHeight || 0;
});

function hdlScroll() {
  if (!containerRef.value) return;
  scrollRect.value.scrollTop = containerRef.value.scrollTop;
  scrollRect.value.scrollHeight = containerRef.value.scrollHeight;
  console.info("178me-debug:", scrollRect.value);
  console.info("178me-debug:", scrollPos.value);
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
  console.info("178me-debug:",ratio.value)
  containerRef.value!.scrollTop += (y - pressY) * ratio.value;
  pressY = y;
}

watch(scrollRect, () => {
  console.info("178me-debug:", scrollRect.value);
});

nextTick(() => {
  if (!containerRef.value) return;
  hdlScroll();
  observer.observe(containerRef.value, {
    childList: true,
  });
  window.addEventListener("mousemove", hdlMove);
  window.addEventListener("mouseup", hdlUp);
});
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
