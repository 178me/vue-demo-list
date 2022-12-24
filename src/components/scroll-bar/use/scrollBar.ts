import { ref, computed, type Ref, type CSSProperties } from "vue"

type ScrollBarOption = {
  containerEl: Ref<HTMLElement | null>
  sliderEl: Ref<HTMLElement | null>
  autoHeight?: boolean
}

export function useScrollBar({
  containerEl,
  sliderEl,
  autoHeight,
}: ScrollBarOption) {
  // 容器的各种数值
  const containerRect = ref({
    scrollTop: 0,
    scrollHeight: 0,
    offsetHeight: 0,
    clientHeight: 0,
  })
  // 滑块的各种数值
  const sliderRect = ref({
    offsetHeight: 0,
    clientHeight: 0,
  })
  // 滚动进度
  const scrollProgress = computed(() => {
    // console.info("178me-debug:","dsf")
    return (
      containerRect.value.scrollTop /
      (containerRect.value.scrollHeight - containerRect.value.clientHeight)
    )
  })
  // 可滚动高度
  const rollableHeight = computed(() => {
    return containerRect.value.clientHeight - sliderRect.value.clientHeight
  })
  // 滚动条滑块高度比
  const sliderRatio = computed(() => {
    return containerRect.value.clientHeight / containerRect.value.scrollHeight
  })
  // 滑块的位置计算
  const sliderPos = computed<CSSProperties>(() => {
    console.info("178me-debug:progress", scrollProgress.value)
    console.info("178me-debug:rollable", rollableHeight.value)
    console.info("178me-debug:ratio", sliderRatio.value)
    console.info("178me-debug:containerRect", containerRect.value)
    console.info("178me-debug:scrollRect", sliderRect.value)
    return {
      top: `${scrollProgress.value * rollableHeight.value}px`,
      height: autoHeight ? `${sliderRatio.value * 100}%` : undefined,
    }
  })
  // 滑块区域与内容区域的比例 移动比例
  const moveRatio = computed(() => {
    return (
      (containerRect.value.scrollHeight - containerRect.value.clientHeight) /
      rollableHeight.value
    )
  })

  // 更新容器高度
  function updateContainerRectHeight() {
    containerRect.value.scrollHeight = containerEl.value?.scrollHeight ?? 0
    containerRect.value.offsetHeight = containerEl.value?.offsetHeight ?? 0
    containerRect.value.clientHeight = containerEl.value?.clientHeight ?? 0
  }

  // 更新滑块高度
  function updateScrollBarRectHeight() {
    sliderRect.value.clientHeight = sliderEl.value?.clientHeight ?? 0
    sliderRect.value.offsetHeight = sliderEl.value?.offsetHeight ?? 0
  }

  // 观察容器和滑块高度变化
  const observer = new MutationObserver((mutationRecord) => {
    if (mutationRecord[0].type === "childList") updateContainerRectHeight()
    else if (mutationRecord[0].type === "attributes")
      updateScrollBarRectHeight()
  })

  // 滚动事件 (scrollTop)
  function hdlScroll() {
    if (!containerEl.value) return
    containerRect.value.scrollTop = containerEl.value.scrollTop
  }
  let pressY = 0

  // 开始拖动
  function hdlMouseDown(e: any) {
    pressY = e.y
  }

  // 结束拖动
  function hdlMouseUp() {
    pressY = 0
  }

  // 监听拖动距离
  function hdlMouseMove(e: any) {
    if (pressY === 0) return
    const { y } = e
    containerEl.value!.scrollTop += (y - pressY) * moveRatio.value
    // 当滚动进度为0和1不更新页面位置
    if (scrollProgress.value === 1) return
    else if (scrollProgress.value === 0) return
    else pressY = y
  }

  function modifySliderEventListener(action: "add" | "remove") {
    let modifyFn = "addEventListener"
    if (action === "add") modifyFn = "addEventListener"
    else if (action === "remove") modifyFn = "addEventListener"

    sliderEl.value?.[modifyFn]("pointerdown", hdlMouseDown)
    window[modifyFn]("pointermove", hdlMouseMove)
    window[modifyFn]("pointerend", hdlMouseUp)
  }

  function init() {
    if (containerEl.value && sliderEl.value) {
      updateContainerRectHeight()
      updateScrollBarRectHeight()
      observer.observe(containerEl.value, {
        childList: true,
      })
      observer.observe(sliderEl.value, {
        attributes: true,
      })
      containerEl.value.addEventListener("scroll", hdlScroll)
      modifySliderEventListener("add")
    } else {
      console.info("useScrollBar:", "初始化失败!", { containerEl, sliderEl })
    }
  }

  return { init, modifySliderEventListener, sliderPos }
}
