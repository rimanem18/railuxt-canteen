import { useInfiniteQuery } from '@tanstack/vue-query'
import type { Order } from '~/types/api'

/**
 * 注文履歴の取得フィルター
 */
export interface OrderFilters {
  status?: string
  start_date?: string
  end_date?: string
}

/**
 * 注文履歴APIのレスポンス型
 */
interface OrderHistoryResponse {
  orders: Order[]
  next_cursor?: string
}

/**
 * 注文履歴を無限スクロールで取得するコンポーザブル
 * @param filters - フィルター条件（ステータス、日付範囲等）
 * @returns 無限クエリの結果と操作関数
 */
export const useOrderHistory = (filters: Ref<OrderFilters> = ref({})) => {
  const base = useRuntimeConfig().public.apiBase
  const { accessToken, client, uid } = useAuth()

  /**
   * 注文履歴を取得する関数
   * @param pageParam - カーソル（次のページの開始位置）
   * @returns 注文履歴のレスポンス
   */
  const fetchOrderHistory = async ({
    pageParam,
  }: {
    pageParam?: string
  }): Promise<OrderHistoryResponse> => {
    const params = new URLSearchParams()

    // フィルター条件をクエリパラメータに追加
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.start_date)
      params.append('start_date', filters.value.start_date)
    if (filters.value.end_date)
      params.append('end_date', filters.value.end_date)

    // カーソル（ページネーション）
    if (pageParam) params.append('cursor', pageParam)

    const url = `${base}/api/v1/orders?${params.toString()}`

    const response = await $fetch<OrderHistoryResponse>(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken.value && { 'access-token': accessToken.value }),
        ...(client.value && { client: client.value }),
        ...(uid.value && { uid: uid.value }),
      },
    })
    return response
  }

  // vue-queryを使用した無限クエリ
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['orders', filters],
    queryFn: fetchOrderHistory,
    getNextPageParam: lastPage => lastPage.next_cursor,
    initialPageParam: undefined,
  })

  /**
   * 全ページのデータをフラット化した注文リスト
   */
  const flattenedOrders = computed(() => {
    return data.value?.pages.flatMap(page => page.orders) ?? []
  })

  /**
   * 注文のステータスを更新する
   * @param orderId - 注文ID
   * @param status - 新しいステータス
   */
  const updateOrderStatus = async (orderId: number, status: string) => {
    await $fetch(`${base}/api/v1/orders/${orderId}`, {
      method: 'PATCH',
      body: { order: { status } },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken.value && { 'access-token': accessToken.value }),
        ...(client.value && { client: client.value }),
        ...(uid.value && { uid: uid.value }),
      },
    })
    // データを再取得して最新状態に同期
    await refetch()
  }

  return {
    // データとステート
    orders: flattenedOrders,
    isLoading,
    isError,
    error,
    // ページネーション
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    // アクション
    refetch,
    updateOrderStatus,
  }
}
