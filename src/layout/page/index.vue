<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div flex="~ col" w="screen" h="screen">
    <span text="center 25px">{{ title }}</span>
    <div v-bind="$attrs" grow><slot></slot></div>
  </div>
</template>
