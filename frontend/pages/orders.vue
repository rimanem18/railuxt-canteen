<script setup lang="ts">
import OrderList from '~/components/OrderList.vue'
import ErrorDisplay from '~/components/ErrorDisplay.vue'

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

// エラー状態管理（ErrorDisplayコンポーネント用に構造化）
const updateError = ref<{ message: string, details?: string } | null>(null)
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
    // エラー情報を構造化してErrorDisplayコンポーネントで表示
    updateError.value = {
      message: '注文の更新に失敗しました',
      details: error.message || '不明なエラーが発生しました',
    }

    // コンソールにもエラーログを出力（開発・デバッグ用）
    console.error('注文ステータス更新エラー:', error)
  }
  finally {
    // 更新中状態を解除
    isUpdating.value.delete(id)
  }
}

/**
 * エラーメッセージを閉じる
 */
const dismissUpdateError = () => {
  updateError.value = null
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

    <!-- 2. データ取得エラーの表示 -->
    <ErrorDisplay
      v-if="isError"
      :error="{ message: 'データの取得に失敗しました', details: error }"
      variant="error"
      :dismissible="false"
    />

    <!-- 3. 更新エラー表示 -->
    <ErrorDisplay
      :error="updateError"
      variant="error"
      @dismiss="dismissUpdateError"
    />

    <!-- 4. フィルター表示（将来的に追加予定のUI） -->
    <div
      v-if="hasActiveFilters && !isLoading"
      class="mb-4 p-4 bg-gray-100 rounded"
    >
      フィルターが適用されています
    </div>

    <!-- 5. 正常にデータが取得できた場合の表示（空状態もOrderListが担当） -->
    <OrderList
      v-if="!isLoading && !isError"
      :orders="orders"
      @update-status="onUpdateStatus"
    />

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
