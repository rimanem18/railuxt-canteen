<template>
  <span
    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold"
    :class="statusDisplay.class"
    :aria-label="`注文ステータス: ${statusDisplay.label}`"
    data-testid="status-badge"
  >
    <span
      class="w-2 h-2 rounded-full mr-2"
      :class="statusDisplay.dotClass"
      aria-hidden="true"
      data-testid="status-dot"
    />
    {{ statusDisplay.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStatus } from '~/composables/useOrderStatus'

/**
 * 注文ステータスバッジを表示するコンポーネント
 * @param status - 表示する注文ステータス
 */
const props = defineProps<{
  /** 表示する注文ステータス */
  status: string
}>()

/**
 * ステータス関連の表示情報を算出する
 * useOrderStatusから表示情報を取得し、UI表示用のオブジェクトを構築
 */
const statusDisplay = computed(() => {
  const { getStatusLabel, getStatusClass, getStatusDotClass } = useOrderStatus(props.status)
  return {
    label: getStatusLabel(),
    class: getStatusClass(),
    dotClass: getStatusDotClass(),
  }
})
</script>
