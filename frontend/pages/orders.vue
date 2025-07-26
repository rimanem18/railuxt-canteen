<script setup lang="ts">
import OrderList from '~/components/OrderList.vue'

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth',
})

// dataだけでなく、pending, error, refreshも受け取る
const {
  data: orders,
  pending,
  error,
  refresh,
} = await useApi('/api/v1/orders')

/**
 * 注文を提供済みに更新する
 * @param id - 更新する注文のID
 */
const onComplete = async (id: number) => {
  // PATCHリクエストで注文ステータスを'completed'に更新
  await useApi(`/api/v1/orders/${id}`, {
    method: 'PATCH',
    body: { status: 'completed' },
  })

  // location.reload()の代わりに、useApiが提供するrefresh関数を呼ぶ
  // これにより、ページ全体をリロードせずにデータのみを効率的に再取得できる
  await refresh()
}
</script>

<template>
  <div>
    <!-- 1. 読み込み中の表示 -->
    <div
      v-if="pending"
      class="text-center p-4"
    >
      読み込み中...
    </div>

    <!-- 2. エラー発生時の表示 -->
    <div
      v-else-if="error"
      class="text-center p-4 text-red-600"
    >
      エラーが発生しました。
      <div class="mt-2 text-sm text-red-500">
        {{ error }}
      </div>
    </div>

    <!-- 3. 正常にデータが取得できた場合の表示 -->
    <OrderList
      v-else-if="orders && orders.length > 0"
      :orders="orders"
      @complete="onComplete"
    />

    <!-- 4. データが空の場合の表示 -->
    <div
      v-else
      class="text-center p-4 text-gray-600"
    >
      注文はありません。
    </div>
  </div>
</template>
