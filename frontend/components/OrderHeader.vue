<template>
  <div class="flex items-start justify-between gap-3">
    <!-- 左側：料理情報とメタデータ -->
    <div class="flex-1 min-w-0">
      <!-- 料理名と数量（プライマリ情報） -->
      <div class="flex items-baseline gap-3 mb-3">
        <h3 class="text-xl font-bold text-gray-900 truncate leading-tight">
          {{ order.dish?.name || '料理名不明' }}
        </h3>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 whitespace-nowrap"
          :aria-label="`注文数量: ${order.quantity}個`"
        >
          × {{ order.quantity }}
        </span>
      </div>

      <!-- 注文者情報（セカンダリ情報） -->
      <div
        v-if="order.user"
        class="mb-3"
      >
        <div
          class="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-lg"
          data-testid="order-user-name"
          role="group"
          :aria-label="`注文者: ${getUserDisplayName(order.user)}`"
        >
          <svg
            class="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700">
            {{ getUserDisplayName(order.user) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/schemas'
import { useUserDisplay } from '~/composables/useUserDisplay'

/**
 * 注文ヘッダーコンポーネント
 * 責任: 料理名・数量・注文者情報の表示グループ
 *
 * DIP原則について:
 * Vue 3のComposition APIでは、composableが既に抽象化レイヤーの役割を果たしている。
 * useUserDisplayは実装詳細を隠蔽し、テスト可能なインターフェースを提供しているため、
 * 現在の設計は既にDIP原則に適合している。
 */
defineProps<{
  /** 表示する注文情報 */
  order: Order
}>()

// Composable経由での抽象化（DIP原則適合）
const { getUserDisplayName } = useUserDisplay()
</script>
