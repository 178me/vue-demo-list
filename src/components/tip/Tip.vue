<script lang="ts" setup>
import { ref, nextTick, onUnmounted, toRaw } from "vue"
import useTestStore from "@/store/test"
import type { TipProps } from "./type"
const props = defineProps<{
  tips?: Array<TipProps>
  clickOverlayClose?: boolean
}>()

const el = ref<HTMLDivElement | null>(null)
const testStore = useTestStore()

function hdl(e: MouseEvent, tip: TipProps) {
  tip.hdl?.(e)
  tip.show = false
}

function onClickOverlay(e: MouseEvent) {
  if (!props.tips?.find((it) => it.show)) return
  if (!e.composedPath().find((it) => it === el.value)) {
    props.tips.forEach((it) => {
      it.show = false
    })
  }
}

nextTick(() => {
  props.clickOverlayClose &&
    window.addEventListener("mousedown", onClickOverlay)
})

onUnmounted(() => {
  testStore.add()
  props.clickOverlayClose &&
    window.removeEventListener("mousedown", onClickOverlay)
})

setInterval(() => {
  console.debug("178me-debug:tip", toRaw(props.tips))
}, 10000)
</script>

<template>
  <Teleport to="#tip">
    <!-- NOTE:这里的动画效果还没有去折腾 -->
    <div
      ref="el"
      class="pointer-events-none absolute inset-0 z-[999] mb-20 flex">
      <div class="flex w-screen flex-col-reverse items-center">
        <TransitionGroup
          enter-active-class="animate-fade-in-up"
          leave-active-class="animate-fade-out-up">
          <div
            @click="(e) => hdl(e, tip)"
            v-for="tip in tips"
            v-show="tip.show"
            :key="tip.id"
            class="blur-bg mt-[10px] rounded-[12px] px-[20px] py-[14px] drop-shadow-[0_2px_0.9rem_rgb(0,0,0,0.15)] last:mt-[0px]">
            <div
              class="pointer-events-auto mr-[8px] flex w-fit cursor-pointer flex-row items-center space-x-[18px] rounded-[12px]">
              <span class="text-[14px] font-medium text-[#000000]">
                {{ tip.message }}
              </span>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translate3d(0, 40%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0%, 0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up linear;
  animation-duration: 0.5s;
}
@keyframes fade-out-up {
  from {
    opacity: 1;
    /* transform: translate3d(0, 0%, 0); */
  }
  to {
    opacity: 0;
    /* transform: translate3d(0, 0%, 0); */
  }
}
.animate-fade-out-up {
  animation: fade-out-up linear;
  animation-duration: 0.5s;
}

.blur-bg {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );

  backdrop-filter: blur(10px);
}
</style>
