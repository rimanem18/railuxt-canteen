<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import DishCard from '~/components/DishCard.vue'
import type { Dish } from '~/types/schemas'

const { data: dishesResponse } = await useApi<{ data: Dish[] }>('/api/v1/dishes')
const dishes = dishesResponse.value?.data || []
const queryClient = useQueryClient()

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
  <div>
    <h1 class="text-2xl mb-4">
      料理一覧
    </h1>
    <div class="grid grid-cols-4 gap-2">
      <DishCard
        v-for="d in dishes"
        :key="d.id"
        :dish="d"
        @order="onOrder"
      />
    </div>
  </div>
</template>
