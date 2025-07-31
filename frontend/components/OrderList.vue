<template>
  <div class="w-full max-w-2xl mx-auto px-4">
    <ul
      class="space-y-3"
      role="list"
      aria-label="注文一覧"
    >
      <li
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md hover:border-gray-200"
        :aria-label="`${order.dish.name}の注文`"
      >
        <!-- メイン情報エリア -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <!-- 左側：注文詳細 -->
          <div class="flex-1 min-w-0">
            <!-- 料理名と数量 -->
            <div class="flex items-baseline gap-2 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ order.dish.name }}
              </h3>
              <span class="text-sm font-medium text-gray-600 whitespace-nowrap">
                × {{ order.quantity }}
              </span>
            </div>

            <!-- ステータスと時刻 -->
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <!-- ステータスバッジ -->
              <div class="flex items-center">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                  :aria-label="`ステータス: ${getStatusLabel(order.status)}`"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getStatusDotClass(order.status)"
                  />
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>

              <!-- 注文時刻 -->
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="w-4 h-4 mr-1 opacity-60"
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
                  {{ formatOrderTime(order.created_at) }}
                </time>
              </div>
            </div>
          </div>

          <!-- 右側：アクションボタン -->
          <div class="flex items-center justify-end sm:justify-start sm:ml-4">
            <button
              v-if="
                order.status !== 'completed' && order.status !== 'cancelled'
              "
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="`${order.dish.name}を提供済みにする`"
              @click="$emit('updateStatus', order.id, 'completed')"
            >
              <svg
                class="w-4 h-4 mr-1.5"
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

// 日時フォーマット機能を取得
const { formatRelativeTime } = useFormatDateTime()

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
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    preparing: 'bg-orange-50 text-orange-700 border border-orange-200',
    ready: 'bg-green-50 text-green-700 border border-green-200',
    completed: 'bg-gray-50 text-gray-600 border border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  }
  return classes[status] || 'bg-gray-50 text-gray-600 border border-gray-200'
}

/**
 * ステータスドットの表示クラスを取得する
 * @param status - 注文ステータス
 * @returns CSSクラス
 */
const getStatusDotClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-400',
    preparing: 'bg-orange-400',
    ready: 'bg-green-400',
    completed: 'bg-gray-400',
    cancelled: 'bg-red-400',
  }
  return classes[status] || 'bg-gray-400'
}

/**
 * 注文時刻をフォーマットして表示する
 * @param createdAt - 注文作成日時（ISO文字列）
 * @returns フォーマットされた時刻文字列
 */
const formatOrderTime = (createdAt: string | undefined): string => {
  return formatRelativeTime(createdAt)
}

/**
 * 完全な日時フォーマットを取得する（tooltip用）
 * @param createdAt - 注文作成日時（ISO文字列）
 * @returns 完全フォーマットされた日時文字列
 */
const formatFullDateTime = (createdAt: string | undefined): string => {
  if (!createdAt) return ''

  const date = new Date(createdAt)
  if (isNaN(date.getTime())) return ''

  // YYYY年M月D日(曜日) HH:MM形式で返す
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}年${month}月${day}日(${weekday}) ${hours}:${minutes}`
}
</script>
