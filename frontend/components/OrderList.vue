<template>
  <div class="w-full max-w-2xl mx-auto px-4">
    <ul
      class="space-y-4"
      role="list"
      aria-label="注文一覧"
    >
      <li
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
        :aria-label="`${order.dish.name}の注文`"
        tabindex="0"
        role="article"
      >
        <!-- メイン情報エリア -->
        <div
          class="flex flex-col gap-4"
        >
          <!-- ヘッダー：料理名・数量・注文者 -->
          <div class="flex items-start justify-between gap-3">
            <!-- 左側：料理情報とメタデータ -->
            <div class="flex-1 min-w-0">
              <!-- 料理名と数量（プライマリ情報） -->
              <div class="flex items-baseline gap-3 mb-3">
                <h3 class="text-xl font-bold text-gray-900 truncate leading-tight">
                  {{ order.dish.name }}
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

            <!-- 右側：ステータスバッジ -->
            <div class="flex-shrink-0">
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold"
                :class="getStatusDisplay(order.status).class"
                :aria-label="`注文ステータス: ${getStatusDisplay(order.status).label}`"
              >
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="getStatusDisplay(order.status).dotClass"
                />
                {{ getStatusDisplay(order.status).label }}
              </span>
            </div>
          </div>

          <!-- フッター：時刻とアクション -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <!-- 注文時刻 -->
            <div class="flex items-center text-sm text-gray-500">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <time
                :datetime="order.created_at"
                :title="`注文日時: ${formatFullDateTime(order.created_at)}`"
                class="font-medium"
              >
                {{ formatRelativeTime(order.created_at) }}
              </time>
            </div>

            <!-- アクションボタン -->
            <div class="flex items-center">
              <button
                v-if="
                  order.status !== 'completed' && order.status !== 'cancelled'
                "
                class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                :aria-label="`${order.dish.name}を提供済みにする`"
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
        </div>
      </li>
    </ul>

    <!-- 空状態 -->
    <div
      v-if="orders.length === 0"
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
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/schemas'
import { useFormatDateTime } from '~/composables/useFormatDateTime'
import { useOrderStatus } from '~/composables/useOrderStatus'

// 日時フォーマット機能を取得
const { formatRelativeTime, formatFullDateTime } = useFormatDateTime()

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
 * ステータス関連の表示情報を取得する
 * @param status - 注文ステータス
 * @returns ステータス表示関数群
 */
const getStatusDisplay = (status: string) => {
  const { getStatusLabel, getStatusClass, getStatusDotClass } = useOrderStatus(status)
  return {
    label: getStatusLabel(),
    class: getStatusClass(),
    dotClass: getStatusDotClass(),
  }
}

/**
 * ユーザーの表示名を取得する
 * @param user - ユーザー情報
 * @returns 表示用の名前（名前がない場合は「名前なし」）
 */
const getUserDisplayName = (user: { name?: string } | undefined): string => {
  if (!user?.name || user.name.trim() === '') {
    return '名前なし'
  }
  return user.name
}
</script>
