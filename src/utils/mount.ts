import { type Component, type App, createApp, onMounted, ref } from "vue"

interface Instance {
  app: App<Element>
  mountEl: HTMLElement
}
const instanceList = ref<Array<Instance>>([])

function getApp(id: string) {
  return instanceList.value.find((it) => it.mountEl.id === id)?.app
}

export default function mount(Host: Component, id: string) {
  onMounted(() => {
    let app = getApp(id)
    if (!app) {
      app = createApp(Host)
      const mountEl = document.createElement("div")
      mountEl.setAttribute("id", id)
      document.body.appendChild(mountEl)
      app.mount(mountEl)
      instanceList.value.push({
        app: app,
        mountEl: mountEl,
      })
    }
  })
  return {}
}
