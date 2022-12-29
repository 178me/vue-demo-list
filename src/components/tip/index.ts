import { ref, h, toRaw } from "vue"
import Tip from "./Tip.vue"
import type { TipProps } from "./type"
import mount from "@/utils/mount"

interface TipOption {
  message?: string
  duration?: number
  hdl?: (payload: MouseEvent) => void
}

const defaultTip = {
  message: "",
  duration: 3000,
  hdl: () => {},
}

export default function TipManage() {
  const tips = ref<Array<TipProps>>([])
  const toastComponent = {
    setup() {
      return () =>
        h(Tip, {
          tips: tips.value,
          clickOverlayClose: true,
        })
    },
  }
  mount(toastComponent, "tip")

  setInterval(() => {
    console.debug("178me-debug:manage", toRaw(tips.value))
  }, 10000)

  // 发送提示
  function present(id: string, props: TipOption) {
    const tipIndex = tips.value.findIndex((it) => it.id === id)
    if (tipIndex !== -1) {
      tips.value[tipIndex] = Object.assign(
        tips.value[tipIndex],
        props as TipOption
      )
      tips.value[tipIndex].show = true
    } else {
      tips.value.push(Object.assign(props, { id: id, show: true }))
    }
    props = Object.assign(defaultTip, props)
    if ((props.duration || defaultTip.duration) > 0)
      setTimeout(dismiss, props.duration, id)
  }

  // 关闭提示
  function dismiss(id: string | undefined = undefined) {
    tips.value.forEach((it) => {
      if (!id || id === it.id) it.show = false
    })
  }
  return {
    present,
    dismiss,
  }
}
