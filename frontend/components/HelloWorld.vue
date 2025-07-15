<script setup lang="ts">
/** グリーティングメッセージを表示するコンポーネント */
const props = defineProps<{
  /** 表示する名前 */
  name: string;
}>();
</script>

<template>
  <div
    class="min-h-64 flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-3xl shadow-2xl p-10"
  >
    <div class="flex items-center gap-4 mb-4">
      <Icon name="mdi:party-popper" class="text-5xl text-yellow-300" />
      <span
        class="text-4xl font-extrabold text-white drop-shadow-lg tracking-widest animate-wiggle"
        >Hello World,</span
      >
      <Icon name="mdi:fire" class="text-5xl text-red-500" />
    </div>
    <p
      class="text-3xl font-bold text-white bg-black/30 px-6 py-2 rounded-full shadow-lg"
    >
      {{ props.name }}
    </p>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
}
.animate-wiggle {
  animation: wiggle 1s infinite;
}
</style>
