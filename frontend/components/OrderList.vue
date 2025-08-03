<template>
  <div class="w-full max-w-2xl mx-auto px-4">
    <!-- 注文がある場合：リスト表示 -->
    <ul
      v-if="orders.length > 0"
      class="space-y-4"
      role="list"
      aria-label="注文一覧"
    >
      <OrderItem
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @update-status="(orderId, newStatus) => $emit('updateStatus', orderId, newStatus)"
      />
    </ul>

    <!-- 注文がない場合：空状態表示 -->
    <OrderItemEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import OrderItem from './OrderItem.vue'
import OrderItemEmpty from './OrderItemEmpty.vue'
import type { Order } from '~/types/schemas'

/**
 * 注文一覧を表示するコンテナコンポーネント
 * 責任: 注文配列を受け取り、空の場合は空状態、ある場合はリスト表示
 */
defineProps<{
  /** 表示する注文のリスト */
  orders: Order[]
}>()

/** 注文ステータス更新イベント */
defineEmits<{
  updateStatus: [orderId: number, newStatus: string]
}>()
</script>
