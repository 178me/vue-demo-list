<template>
  <Teleport to="body">
    <transition name="overlay" appear>
      <div class="fixed top-0 bg-black/40 h-full w-full" />
    </transition>
  </Teleport>
</template>
<style lang="css">

.overlay-enter-from,
.overlay-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
</style>
