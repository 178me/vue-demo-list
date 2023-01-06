<script setup lang="ts"></script>

<template>
  <div class="w-screen h-screen overflow-hidden1 flex flex-col">
    <div h="full" w="full" bg="gray" overflow="auto">
      <div
        v-for="it in 300"
        class="flex overflow-x-scroll snap-x scroll-smooth"
        text-center>
        <div flex="~ row" class="shrink-0 h-60px basis-full snap-end bg-yellow">
          {{ it }}
        </div>
        <div
          snap-end
          @click=""
          flex="~ "
          class="h-full w-80px bg-#E35244"
          shrink-0
          text="14px white"
          leading-20px>
          删除
        </div>
      </div>
    </div>
  </div>
</template>
