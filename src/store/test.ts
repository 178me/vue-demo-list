import { defineStore } from "pinia"
import { ref } from "vue"

const useTestStore = defineStore("test", () => {
  const count = ref(0)

  function add() {
    count.value += 1
  }
  return { count, add }
})
export default useTestStore
