<template>
  <!-- 空状態 -->
  <div
    class="text-center py-12"
    role="status"
    aria-live="polite"
  >
    <div class="w-16 h-16 mx-auto mb-4 opacity-40">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        class="w-full h-full text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <p class="text-gray-500 text-sm">
      注文はありません
    </p>
  </div>
</template>

<script setup lang="ts">
/** 注文が空の状態を表示するコンポーネント */
</script>
