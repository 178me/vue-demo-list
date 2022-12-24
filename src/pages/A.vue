<template>
  <div flex="~ col" w-screen h="screen">
    <span text="center 25px">测试拖拽</span>
    <div class="overflow-auto" grid="~ cols-3 gap-10px">
      <div v-for="i in 30" flex="~ col" items-center>
        <Draggable
          v-slot="{ isDragging }"
          @start="showDropZone = true"
          @end="showDropZone = false"
          @dropover="hdlEnter"
          :drop-el="dropEl">
          <div h-50px w-50px bg-blue-500 />
          <span v-if="!isDragging" only="text-15px">{{ i }}</span>
        </Draggable>
      </div>
    </div>
    <transition
      enter-active-class="animate-fade-in-up animate-duration-350"
      leave-active-class="animate-fade-out-down animate-duration-350">
      <div
        v-if="showDropZone"
        @touchmove="hdlEnter"
        ref="dropEl"
        bg-red
        w-full
        h-200px>
        拖动到这儿
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import Draggable from "@/components/draggable/index.vue"
const dropEl = ref<null | HTMLElement>(null)
const showDropZone = ref(false)

function hdlEnter() {
  alert("拖放成功")
}

onMounted(() => {})
</script>
