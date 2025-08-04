import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Vue Query（TanStack Query）の設定
   * 無限スクロールとページネーション機能に最適化された設定
   */
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // データが古くなる時間（5分）
        staleTime: 1000 * 60 * 5,
        // キャッシュの有効期間（10分）- v5からgcTimeに変更
        gcTime: 1000 * 60 * 10,
        // エラー時の再試行回数
        retry: 2,
        // バックグラウンドでの再取得を有効化
        refetchOnWindowFocus: false,
      },
    },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })

  return {
    provide: {
      queryClient,
    },
  }
})
