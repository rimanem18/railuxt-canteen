<script setup lang="ts">
import OrderList from '~/components/OrderList.vue'

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth',
})

// フィルター機能を使用
const { filters, hasActiveFilters } = useOrderFilters()

// 注文履歴を無限スクロールで取得
const {
  orders,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  updateOrderStatus,
} = useOrderHistory(filters)

// エラー状態管理
const updateError = ref<string | null>(null)
const isUpdating = ref<Set<number>>(new Set())

/**
 * 注文ステータスを更新する
 * @param id - 更新する注文のID
 * @param newStatus - 新しいステータス
 */
const onUpdateStatus = async (id: number, newStatus: string) => {
  try {
    // エラー状態をリセット
    updateError.value = null

    // 更新中状態を設定（重複実行防止）
    isUpdating.value.add(id)

    // useOrderHistoryのupdateOrderStatus関数を使用
    // これにより自動的にキャッシュが更新され、UIが最新状態に同期される
    await updateOrderStatus(id, newStatus)
  }
  catch (error: any) {
    // エラーメッセージを設定
    updateError.value = error.message || '注文の更新に失敗しました'

    // コンソールにもエラーログを出力（開発・デバッグ用）
    console.error('注文ステータス更新エラー:', error)
  }
  finally {
    // 更新中状態を解除
    isUpdating.value.delete(id)
  }
}
</script>

<template>
  <div>
    <!-- 1. 読み込み中の表示 -->
    <div
      v-if="isLoading"
      class="text-center p-4"
    >
      読み込み中...
    </div>

    <!-- 2. エラー発生時の表示 -->
    <div
      v-else-if="isError"
      class="text-center p-4 text-red-600"
    >
      エラーが発生しました。
      <div class="mt-2 text-sm text-red-500">
        {{ error }}
      </div>
    </div>

    <!-- 3. 更新エラー表示 -->
    <div
      v-if="updateError"
      class="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded"
    >
      <div class="flex items-center justify-between">
        <span>{{ updateError }}</span>
        <button
          class="ml-2 text-red-500 hover:text-red-700"
          @click="updateError = null"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 4. フィルター表示（将来的に追加予定のUI） -->
    <div
      v-if="hasActiveFilters && !isLoading"
      class="mb-4 p-4 bg-gray-100 rounded"
    >
      フィルターが適用されています
    </div>

    <!-- 5. 正常にデータが取得できた場合の表示 -->
    <OrderList
      v-if="orders.length > 0"
      :orders="orders"
      :updating-orders="Array.from(isUpdating)"
      @update-status="onUpdateStatus"
    />

    <!-- 6. データが空の場合の表示 -->
    <div
      v-else-if="!isLoading && !isError"
      class="text-center p-4 text-gray-600"
    >
      注文はありません。
    </div>

    <!-- 7. 無限スクロール用のローディング -->
    <div
      v-if="isFetchingNextPage"
      class="text-center p-4"
    >
      さらに読み込み中...
    </div>

    <!-- 8. 無限スクロール用のボタン -->
    <button
      v-if="hasNextPage && !isFetchingNextPage"
      class="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      @click="fetchNextPage"
    >
      さらに読み込む
    </button>
  </div>
</template>
