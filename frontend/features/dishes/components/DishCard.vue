<template>
  <div
    class="border p-4 rounded-lg shadow hover:shadow-md transition-shadow min-w-64"
  >
    <h2 class="font-bold text-lg">
      {{ dish.name }}
    </h2>
    <p class="mt-2 text-sm">
      ¥{{ dish.price }}
    </p>
    <button
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="$emit('order', dish.id)"
    >
      注文する
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Dish } from '../types/index'

/** 料理カードを表示するコンポーネント */
defineProps<{
  /** 表示する料理の情報 */
  dish: Dish
}>()

/**
 * 料理の注文イベント
 * @param order - 料理IDを受け取る
 */
defineEmits<{
  order: [dishId: number]
}>()
</script>
