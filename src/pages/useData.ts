import { createSharedComposable } from "@vueuse/core"
import { ref } from "vue"

export function useData() {
  const count = ref("A")
  return { count }
}

export const useSharedData = createSharedComposable(useData)
