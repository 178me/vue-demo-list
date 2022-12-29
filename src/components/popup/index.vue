<script lang="ts" setup>
// import { provide } from "vue";
// import { closeDialogKey } from "./keys";

import { getCurrentInstance } from "vue"

export interface DialogProps {
  // 显示和隐藏
  visiable?: boolean
  // 遮罩是否可点击关闭
  closeOnClickOverlay?: boolean
  // 对话框对外暴露class修改样式
  dialogClass?: string | string[] | object
}
const props = withDefaults(defineProps<DialogProps>(), {
  visiable: false,
  closeOnClickOverlay: true,
  dialogClass: "",
})
const emit = defineEmits(["update:visiable"])

const hdlClickOverlay = () => {
  props.closeOnClickOverlay && emit("update:visiable", false)
}

// 提供关闭方法给插槽组件
// provide(closeDialogKey, () => emit("update:visiable", false));
const duration = "0.5s"
const duration2 = "0.5s"

const vm = getCurrentInstance()
function hdlLeave() {
  vm?.parent?.vnode.el?.remove()
}
</script>

<template>
  <Transition name="modal" @after-leave="hdlLeave">
    <div
      @click="hdlClickOverlay"
      v-if="visiable"
      class="absolute inset-0 bottom-0 z-50 flex bg-stone-900 bg-opacity-50">
      <div
        @click.stop
        class="dialog absolute bottom-0 flex flex-col"
        h-600px
        bg-blue
        w-full>
        <div>ActionSheet</div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: all v-bind(duration) ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .dialog {
  animation: fade-in-up v-bind(duration2) ease-in;
}
.modal-leave-active .dialog {
  animation: fade-out-down v-bind(duration2) ease-out;
  opacity: 0;
}
</style>
