<script setup lang="ts">
import ScrollBar from "@/components/scroll-bar/index.vue"
</script>

<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col">
    <div h-100px></div>
    <ScrollBar>
      <div h="500px" w="full" bg="gray" overflow="auto" my-0px>
        <div v-for="it in 300" text-center pr-13px>
          <div h="50px">
            {{ it }}
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
