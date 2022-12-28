<template>
  <div flex="~ col" w-screen h="screen">
    <span text="center 25px">测试拖拽</span>
    <div class="overflow-auto" grid="~ cols-3 gap-10px">
      <div v-for="i in 50" flex="~ col" items-center>
        <Draggable
          v-slot="{ isDragging }"
          @start="showDropZone = true"
          @end="showDropZone = false"
          @dropenter="isEnter = true"
          @dropleave="isEnter = false"
          @dropover="hdlEnter"
          :drop-el="dropEl">
          <div bg-red-100 h-50px w-50px />
          <span v-if="!isDragging" only="text-15px">{{ i }}</span>
        </Draggable>
      </div>
    </div>
    <transition
      enter-active-class="animate-fade-in-up animate-duration-350"
      leave-active-class="animate-fade-out-down animate-duration-350">
      <div
        v-if="showDropZone"
        ref="dropEl"
        flex="~"
        :bg="isEnter ? '#2EC1CC' : '#A1E3E8'"
        text="14px white"
        class="fixed bottom-0"
        items-center
        justify-center
        font-medium
        w-full
        h-83px>
        {{ isEnter ? "松手即可发送到桌面" : "拖到此处发送到桌面" }}
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import Draggable from "@/components/draggable/index.vue"
const dropEl = ref<null | HTMLElement>(null)
const showDropZone = ref(false)
const isEnter = ref(false)

function hdlEnter() {
  alert("拖放成功")
}

onMounted(() => {})
</script>
