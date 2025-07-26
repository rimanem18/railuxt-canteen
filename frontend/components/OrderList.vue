<template>
  <ul class="w-full max-w-xl mx-auto">
    <li
      v-for="order in orders"
      :key="order.id"
      class="flex items-center justify-between p-2 border-b"
    >
      <div>
        <span class="font-medium">{{ order.dish.name }}</span>
        <span class="ml-2 text-gray-600">× {{ order.quantity }}</span>
        <span
          v-if="order.status === 'completed'"
          class="ml-2 text-gray-500"
        >(提供済み)</span>
      </div>
      <button
        v-if="order.status !== 'completed'"
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        @click="$emit('complete', order.id)"
      >
        提供済みにする
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Order } from '~/types/schemas'

/** 注文一覧を表示するコンポーネント */
defineProps<{
  /** 表示する注文のリスト */
  orders: Order[]
}>()

/**
 * 注文の提供完了イベント
 * @param complete - 注文IDを受け取る
 */
defineEmits<{
  complete: [orderId: number]
}>()
</script>
