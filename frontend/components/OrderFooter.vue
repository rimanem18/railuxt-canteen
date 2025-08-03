<template>
  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
    <!-- 注文時刻 -->
    <OrderTimestamp :created-at="order.created_at || ''" />

    <!-- アクションボタン -->
    <div class="flex items-center">
      <button
        v-if="order.status !== 'completed' && order.status !== 'cancelled'"
        class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
        :aria-label="`${order.dish?.name || '料理'}を提供済みにする`"
        @click="$emit('updateStatus', order.id, 'completed')"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        提供済み
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderTimestamp from './OrderTimestamp.vue'
import type { Order } from '~/types/schemas'

/**
 * 注文フッターコンポーネント
 * 責任: 時刻・アクションボタンの表示グループ
 */
defineProps<{
  /** 表示する注文情報 */
  order: Order
}>()

/**
 * 注文ステータス更新イベント
 * @param updateStatus - 注文IDと新しいステータスを受け取る
 */
defineEmits<{
  updateStatus: [orderId: number, newStatus: string]
}>()
</script>
