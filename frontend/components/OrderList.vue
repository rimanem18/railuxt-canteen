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
          class="ml-2 text-sm px-2 py-1 rounded"
          :class="getStatusClass(order.status)"
        >
          {{ getStatusLabel(order.status) }}
        </span>
      </div>
      <button
        v-if="order.status !== 'completed' && order.status !== 'cancelled'"
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        @click="$emit('updateStatus', order.id, 'completed')"
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
 * 注文ステータス更新イベント
 * @param updateStatus - 注文IDと新しいステータスを受け取る
 */
defineEmits<{
  updateStatus: [orderId: number, newStatus: string]
}>()

/**
 * ステータスのラベル表示を取得する
 * @param status - 注文ステータス
 * @returns 表示用ラベル
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: '未提供',
    confirmed: '受付済み',
    preparing: '調理中',
    ready: '提供準備完了',
    completed: '提供済み',
    cancelled: 'キャンセル',
  }
  return labels[status] || status
}

/**
 * ステータスの表示クラスを取得する
 * @param status - 注文ステータス
 * @returns CSSクラス
 */
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
