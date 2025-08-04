<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import DishCard from '~/components/DishCard.vue'
import type { Dish } from '~/types/schemas'

const { data: dishesResponse, pending, error } = await useApi<{ data: Dish[] }>('/api/v1/dishes')
const dishes = computed(() => dishesResponse.value?.data || [])
const queryClient = useQueryClient()

/**
 * データを手動で更新する処理
 * エラー時や空状態からの再試行に使用
 */
const refreshData = async () => {
  // キャッシュを無効化して最新データを取得
  await queryClient.invalidateQueries({
    queryKey: ['/api/v1/dishes'],
  })

  // ページをリロードして最新状態を反映
  await navigateTo('/') // ページのリロードで代替
}

/**
 * 料理を注文する処理
 * @param id - 注文する料理のID
 * @throws エラー発生時は例外をスローし、ユーザーにエラーメッセージを表示
 */
const onOrder = async (id: number) => {
  try {
    // 注文ID の妥当性確認
    if (!id || id <= 0) {
      throw new Error('無効な料理IDです')
    }

    // 注文数量は固定で1としている（将来的にはユーザーが数量を選択できるようにする可能性がある）
    await useApi('/api/v1/orders', {
      method: 'POST',
      body: { order: { dish_id: id, quantity: 1 } },
    })

    // 注文一覧のキャッシュを無効化して最新データを取得
    // 'orders' で始まるすべてのクエリキーを無効化（フィルター条件に関係なく）
    await queryClient.invalidateQueries({
      queryKey: ['orders'],
    })

    // 成功通知
    alert('注文しました')
  }
  catch (error: any) {
    // エラーハンドリング
    console.error('注文作成エラー:', error)

    // エラーの種類に応じて適切なメッセージを表示
    if (error.status === 401) {
      alert('認証が無効です。再ログインしてください。')
    }
    else if (error.status === 403) {
      alert('この操作を実行する権限がありません。')
    }
    else if (error.status === 422) {
      alert('無効なデータです。入力内容を確認してください。')
    }
    else if (error.status >= 500) {
      alert('サーバーエラーが発生しました。しばらく経ってから再試行してください。')
    }
    else if (!navigator.onLine) {
      alert('インターネット接続を確認してください。')
    }
    else {
      alert(error.message || '注文の作成に失敗しました。')
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ページヘッダー -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-2xl font-bold text-gray-900">
            料理一覧
          </h1>
          <!-- 将来的にフィルターやソート機能を追加する際のスペース -->
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 1. 読み込み中の表示 - スピナー + スケルトンローダー -->
      <div
        v-if="pending"
        class="space-y-8"
        role="status"
        aria-label="料理一覧を読み込み中"
      >
        <!-- 読み込み中のメッセージとスピナー -->
        <div class="flex flex-col items-center justify-center py-12">
          <!-- 回転スピナー -->
          <div class="relative">
            <div
              class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
              aria-hidden="true"
            />
            <div class="sr-only">
              読み込み中
            </div>
          </div>
          <p class="mt-4 text-lg font-medium text-gray-600">
            美味しい料理を準備中...
          </p>
          <p class="mt-1 text-sm text-gray-500">
            しばらくお待ちください
          </p>
        </div>

        <!-- スケルトンローダー（料理カードの形状をシミュレート） -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          aria-hidden="true"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <!-- 料理名のスケルトン -->
            <div class="h-6 bg-gray-200 rounded-lg mb-3" />
            <!-- 価格のスケルトン -->
            <div class="h-8 bg-gray-200 rounded-lg w-24 mb-6" />
            <!-- ボタンのスケルトン -->
            <div class="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>

      <!-- 2. エラー発生時の表示 -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-16"
        role="alert"
        aria-live="polite"
      >
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
          <!-- エラーアイコン -->
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                class="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <!-- エラーメッセージ -->
          <h2 class="text-xl font-semibold text-red-900 mb-2">
            読み込みエラー
          </h2>
          <p class="text-red-700 mb-4">
            料理一覧の取得に失敗しました
          </p>
          <details class="mb-6">
            <summary class="text-sm text-red-600 cursor-pointer hover:text-red-800 transition-colors">
              詳細情報を表示
            </summary>
            <p class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border font-mono">
              {{ error }}
            </p>
          </details>

          <!-- 再試行ボタン -->
          <button
            type="button"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
            @click="refreshData"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            再試行
          </button>
        </div>
      </div>

      <!-- 3. 料理データが空の場合の表示 -->
      <div
        v-else-if="!dishes || dishes.length === 0"
        class="flex flex-col items-center justify-center py-16"
        role="region"
        aria-label="空の状態"
      >
        <div class="text-center max-w-md">
          <!-- 空状態のイラストレーション -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                class="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>

          <!-- メッセージ -->
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">
            まだ料理がありません
          </h2>
          <p class="text-gray-600 mb-6">
            現在表示できる料理がありません。<br>
            少し時間をおいてから再度お試しください。
          </p>

          <!-- アクションボタン -->
          <button
            type="button"
            class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            @click="refreshData"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            更新
          </button>
        </div>
      </div>

      <!-- 4. 正常時の料理一覧表示 -->
      <div v-else>
        <!-- 料理数の表示 -->
        <div class="mb-8">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ dishes.length }}</span> 品の料理が見つかりました
          </p>
        </div>

        <!-- 料理一覧グリッド -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="grid"
          :aria-label="`${dishes.length}品の料理一覧`"
        >
          <DishCard
            v-for="d in dishes"
            :key="d.id"
            :dish="d"
            role="gridcell"
            @order="onOrder"
          />
        </div>

        <!-- フッターメッセージ -->
        <div class="mt-12 text-center">
          <p class="text-sm text-gray-500">
            お気に入りの料理を見つけて、ぜひご注文ください！
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
