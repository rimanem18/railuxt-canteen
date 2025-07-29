import type { OrderFilters } from './useOrderHistory'

/**
 * 注文履歴のフィルタリング機能を提供するコンポーザブル
 * URLクエリパラメータと連携してフィルター状態を管理
 */
export const useOrderFilters = () => {
  const route = useRoute()
  const router = useRouter()

  /**
   * フィルター状態
   * URLクエリパラメータから初期値を取得
   */
  const filters = ref<OrderFilters>({
    status: (route.query.status as string) || undefined,
    start_date: (route.query.start_date as string) || undefined,
    end_date: (route.query.end_date as string) || undefined,
  })

  /**
   * ステータスフィルターを設定
   * @param status - 注文ステータス（undefinedで全て表示）
   */
  const setStatusFilter = (status: string | undefined) => {
    filters.value.status = status
    updateUrlQuery()
  }

  /**
   * 日付範囲フィルターを設定
   * @param startDate - 開始日（YYYY-MM-DD形式）
   * @param endDate - 終了日（YYYY-MM-DD形式）
   */
  const setDateRangeFilter = (startDate?: string, endDate?: string) => {
    filters.value.start_date = startDate
    filters.value.end_date = endDate
    updateUrlQuery()
  }

  /**
   * 全てのフィルターをクリア
   */
  const clearFilters = () => {
    filters.value = {
      status: undefined,
      start_date: undefined,
      end_date: undefined,
    }
    updateUrlQuery()
  }

  /**
   * URLクエリパラメータを更新
   * フィルター状態をブラウザのURLに反映し、リロード時も状態を保持
   */
  const updateUrlQuery = () => {
    const query: Record<string, string> = {}

    if (filters.value.status) query.status = filters.value.status
    if (filters.value.start_date) query.start_date = filters.value.start_date
    if (filters.value.end_date) query.end_date = filters.value.end_date

    router.push({ query })
  }

  /**
   * フィルターが適用されているかどうか
   */
  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.status
      || filters.value.start_date
      || filters.value.end_date
    )
  })

  /**
   * ステータスフィルターの選択肢
   */
  const statusOptions = [
    { value: undefined, label: '全て' },
    { value: 'pending', label: '未提供' },
    { value: 'confirmed', label: '受付済み' },
    { value: 'preparing', label: '調理中' },
    { value: 'ready', label: '提供準備完了' },
    { value: 'completed', label: '提供済み' },
    { value: 'cancelled', label: 'キャンセル' },
  ]

  return {
    // 状態
    filters: readonly(filters),
    hasActiveFilters,
    statusOptions,
    // メソッド
    setStatusFilter,
    setDateRangeFilter,
    clearFilters,
  }
}
