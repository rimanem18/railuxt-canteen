<template>
  <li
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    :aria-label="`${order.dish?.name || '料理'}の注文`"
    tabindex="0"
    role="article"
  >
    <!-- メイン情報エリア -->
    <div class="flex flex-col gap-4">
      <!-- ヘッダー：料理名・数量・注文者 -->
      <div class="flex items-start justify-between gap-3">
        <OrderHeader :order="order" />

        <!-- 右側：ステータスバッジ -->
        <div class="flex-shrink-0">
          <OrderStatus :status="order.status" />
        </div>
      </div>

      <!-- フッター：時刻とアクション -->
      <OrderFooter
        :order="order"
        @update-status="(orderId, newStatus) => $emit('updateStatus', orderId, newStatus)"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import OrderHeader from './OrderHeader.vue'
import OrderStatus from './OrderStatus.vue'
import OrderFooter from './OrderFooter.vue'
import type { Order } from '~/types/schemas'

/**
 * 注文アイテムコンポーネント
 * 責任: 単一注文アイテムの全体表示制御
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
