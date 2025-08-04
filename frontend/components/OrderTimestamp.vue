<template>
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
      :datetime="createdAt"
      :title="`注文日時: ${formatFullDateTime(createdAt)}`"
      class="font-medium"
    >
      {{ formatRelativeTime(createdAt) }}
    </time>
  </div>
</template>

<script setup lang="ts">
import { useFormatDateTime } from '~/composables/useFormatDateTime'

// 日時フォーマット機能を取得
const { formatRelativeTime, formatFullDateTime } = useFormatDateTime()

/**
 * 注文時刻を表示するコンポーネント
 */
defineProps<{
  /** 注文作成日時 */
  createdAt: string
}>()
</script>
