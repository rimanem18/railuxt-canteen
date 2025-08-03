<template>
  <div
    v-if="error"
    :class="errorClasses"
    role="alert"
    aria-live="polite"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-start gap-3">
        <!-- エラーアイコン（種別に応じて変更可能） -->
        <component
          :is="errorIcon"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />

        <div>
          <!-- メインエラーメッセージ -->
          <p class="font-medium">
            {{ error.message }}
          </p>

          <!-- 詳細エラーメッセージ（オプション） -->
          <p
            v-if="error.details"
            class="mt-1 text-sm opacity-80"
          >
            {{ error.details }}
          </p>
        </div>
      </div>

      <!-- 閉じるボタン（dismissible=trueの場合のみ表示） -->
      <button
        v-if="dismissible"
        class="ml-4 flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        type="button"
        :aria-label="`エラーメッセージを閉じる: ${error.message}`"
        @click="$emit('dismiss')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- アクションボタン（オプション） -->
    <div
      v-if="$slots.actions"
      class="mt-3 pt-3 border-t border-current border-opacity-20"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * エラー情報の型定義
 */
interface ErrorInfo {
  /** メインエラーメッセージ */
  message: string
  /** 詳細エラーメッセージ（オプション） */
  details?: string
}

/**
 * エラー表示の種別
 */
type ErrorVariant = 'error' | 'warning' | 'info'

/**
 * エラー表示コンポーネント
 *
 * OCP原則適用:
 * - 新しいエラー表示パターンの追加時に既存コードを変更せずに済む
 * - variant propで表示スタイルを切り替え可能
 * - slotsで拡張可能な設計
 */
const props = withDefaults(defineProps<{
  /** 表示するエラー情報 */
  error: ErrorInfo | null
  /** エラー表示の種別 */
  variant?: ErrorVariant
  /** 閉じるボタンの表示有無 */
  dismissible?: boolean
}>(), {
  variant: 'error',
  dismissible: true,
})

/**
 * エラー閉じるイベント
 */
defineEmits<{
  dismiss: []
}>()

/**
 * エラー種別に応じたCSSクラスを計算
 *
 * OCP原則: 新しいvariantを追加する際も既存の条件分岐を変更せず、
 * オブジェクトに新しいキーを追加するだけで対応可能
 */
const errorClasses = computed(() => {
  const baseClasses = 'mb-4 p-4 border rounded-lg'

  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return `${baseClasses} ${variantClasses[props.variant]}`
})

/**
 * エラー種別に応じたアイコンコンポーネントを計算
 *
 * OCP原則: 新しいアイコンを追加する際も既存の条件分岐を変更せず、
 * オブジェクトに新しいキーを追加するだけで対応可能
 */
const errorIcon = computed(() => {
  const iconMap = {
    error: 'svg',
    warning: 'svg',
    info: 'svg',
  }

  return iconMap[props.variant]
})
</script>
