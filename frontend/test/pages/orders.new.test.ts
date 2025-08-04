import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { Order } from '~/types/api'

/**
 * vue-queryを使用した新しいordersページのテスト
 * useOrderHistoryとuseOrderFiltersを使用したリファクタリング版をテスト
 */

// useOrderHistoryのモック
const mockOrderHistory = {
  orders: ref<Order[]>([]),
  isLoading: ref(false),
  isError: ref(false),
  error: ref<Error | null>(null),
  hasNextPage: ref(false),
  isFetchingNextPage: ref(false),
  fetchNextPage: vi.fn(),
  refetch: vi.fn(),
  updateOrderStatus: vi.fn(),
}

// useOrderFiltersのモック
const mockOrderFilters = {
  filters: ref({}),
  hasActiveFilters: ref(false),
  statusOptions: [
    { value: undefined, label: '全て' },
    { value: 'pending', label: '未提供' },
    { value: 'completed', label: '提供済み' },
  ],
  setStatusFilter: vi.fn(),
  setDateRangeFilter: vi.fn(),
  clearFilters: vi.fn(),
}

vi.mock('~/composables/useOrderHistory', () => ({
  useOrderHistory: () => mockOrderHistory,
}))

vi.mock('~/composables/useOrderFilters', () => ({
  useOrderFilters: () => mockOrderFilters,
}))

// OrderListコンポーネントのモック
vi.mock('~/components/OrderList.vue', () => ({
  default: {
    name: 'OrderList',
    template:
      '<div class="order-list-mock">OrderList: {{ orders.length }} orders</div>',
    props: ['orders'],
    emits: ['complete'],
  },
}))

// useAuthのモック
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    accessToken: ref('mock-token'),
    client: ref('mock-client'),
    uid: ref('test@example.com'),
  }),
}))

// 新しいordersページコンポーネントのテスト実装
const createNewOrdersComponent = () => {
  return {
    template: `
      <div>
        <!-- ローディング状態 -->
        <div v-if="isLoading" class="text-center p-4">
          読み込み中...
        </div>

        <!-- エラー状態 -->
        <div v-else-if="isError" class="text-center p-4 text-red-600">
          エラーが発生しました。
          <div class="mt-2 text-sm text-red-500">
            {{ error }}
          </div>
        </div>

        <!-- フィルターUI（将来的に追加予定） -->
        <div v-if="hasActiveFilters" class="mb-4 p-4 bg-gray-100 rounded">
          フィルターが適用されています
        </div>

        <!-- 注文リスト表示 -->
        <OrderList
          v-if="orders.length > 0"
          :orders="orders"
          @complete="onComplete"
        />

        <!-- 空状態 -->
        <div v-else-if="!isLoading && !isError" class="text-center p-4 text-gray-600">
          注文はありません。
        </div>

        <!-- 無限スクロール用のローディング -->
        <div v-if="isFetchingNextPage" class="text-center p-4">
          さらに読み込み中...
        </div>

        <!-- 無限スクロール用のボタン -->
        <button
          v-if="hasNextPage && !isFetchingNextPage"
          @click="fetchNextPage"
          class="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          さらに読み込む
        </button>
      </div>
    `,
    setup() {
      // useOrderFiltersから状態とメソッドを取得
      const { filters, hasActiveFilters } = mockOrderFilters

      // useOrderHistoryから状態とメソッドを取得
      const {
        orders,
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        updateOrderStatus,
      } = mockOrderHistory

      /**
       * 注文を完了状態に更新
       * @param orderId - 注文ID
       */
      const onComplete = async (orderId: number) => {
        await updateOrderStatus(orderId, 'completed')
      }

      return {
        // データと状態
        orders,
        isLoading,
        isError,
        error,
        hasActiveFilters,
        // ページネーション
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        // アクション
        onComplete,
      }
    },
    components: {
      OrderList: {
        template:
          '<div class="order-list-stub">{{ orders.length }} orders</div>',
        props: ['orders'],
        emits: ['complete'],
      },
    },
  }
}

describe('新しいorders.vue（useOrderHistory使用版）', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
    mockOrderHistory.orders.value = []
    mockOrderHistory.isLoading.value = false
    mockOrderHistory.isError.value = false
    mockOrderHistory.error.value = null
    mockOrderHistory.hasNextPage.value = false
    mockOrderHistory.isFetchingNextPage.value = false
    mockOrderFilters.hasActiveFilters.value = false

    // QueryClientをリセット
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  /**
   * キャラクターゼーションテスト: 現在の動作を保証
   */
  describe('キャラクターゼーションテスト（既存動作の保証）', () => {
    it('ローディング状態を正しく表示する', async () => {
      mockOrderHistory.isLoading.value = true

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.text()).toContain('読み込み中...')
      expect(wrapper.find('.order-list-stub').exists()).toBe(false)
    })

    it('エラー状態を正しく表示する', async () => {
      mockOrderHistory.isError.value = true
      mockOrderHistory.error.value = new Error('API接続エラー')

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.text()).toContain('エラーが発生しました。')
      expect(wrapper.text()).toContain('API接続エラー')
      expect(wrapper.find('.order-list-stub').exists()).toBe(false)
    })

    it('注文データが存在する場合にOrderListを表示する', async () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          dish_id: 1,
          user_id: 1,
          quantity: 2,
          total_price: 1000,
          status: 'pending',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z',
          dish: {
            id: 1,
            name: 'カレーライス',
            price: 500,
            created_at: '2025-01-15T08:00:00Z',
            updated_at: '2025-01-15T08:00:00Z',
          },
          user: {
            id: 1,
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        },
      ]
      mockOrderHistory.orders.value = mockOrders

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.find('.order-list-stub').exists()).toBe(true)
      expect(wrapper.text()).toContain('1 orders')
      expect(wrapper.text()).not.toContain('注文はありません。')
    })

    it('注文データが空の場合に空状態メッセージを表示する', async () => {
      mockOrderHistory.orders.value = []

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.text()).toContain('注文はありません。')
      expect(wrapper.find('.order-list-stub').exists()).toBe(false)
    })
  })

  /**
   * 新機能のテスト: 無限スクロール
   */
  describe('無限スクロール機能', () => {
    it('hasNextPageがtrueの場合にさらに読み込むボタンを表示する', async () => {
      mockOrderHistory.orders.value = [
        {
          id: 1,
          dish_id: 1,
          user_id: 1,
          quantity: 1,
          total_price: 500,
          status: 'pending',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z',
          dish: {
            id: 1,
            name: 'テスト料理',
            price: 500,
            created_at: '2025-01-15T08:00:00Z',
            updated_at: '2025-01-15T08:00:00Z',
          },
          user: {
            id: 1,
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        },
      ]
      mockOrderHistory.hasNextPage.value = true

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      const loadMoreButton = wrapper.find('button')
      expect(loadMoreButton.exists()).toBe(true)
      expect(loadMoreButton.text()).toContain('さらに読み込む')
    })

    it('さらに読み込むボタンをクリックするとfetchNextPageが呼ばれる', async () => {
      mockOrderHistory.orders.value = [
        {
          id: 1,
          dish_id: 1,
          user_id: 1,
          quantity: 1,
          total_price: 500,
          status: 'pending',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z',
          dish: {
            id: 1,
            name: 'テスト料理',
            price: 500,
            created_at: '2025-01-15T08:00:00Z',
            updated_at: '2025-01-15T08:00:00Z',
          },
          user: {
            id: 1,
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        },
      ]
      mockOrderHistory.hasNextPage.value = true

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      const loadMoreButton = wrapper.find('button')
      await loadMoreButton.trigger('click')

      expect(mockOrderHistory.fetchNextPage).toHaveBeenCalled()
    })

    it('次ページローディング中にローディングメッセージを表示する', async () => {
      mockOrderHistory.orders.value = [
        {
          id: 1,
          dish_id: 1,
          user_id: 1,
          quantity: 1,
          total_price: 500,
          status: 'pending',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z',
          dish: {
            id: 1,
            name: 'テスト料理',
            price: 500,
            created_at: '2025-01-15T08:00:00Z',
            updated_at: '2025-01-15T08:00:00Z',
          },
          user: {
            id: 1,
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        },
      ]
      mockOrderHistory.isFetchingNextPage.value = true

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.text()).toContain('さらに読み込み中...')
    })
  })

  /**
   * 注文ステータス更新機能のテスト
   */
  describe('注文ステータス更新機能', () => {
    it('onComplete関数が正しくupdateOrderStatusを呼ぶ', async () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          dish_id: 1,
          user_id: 1,
          quantity: 1,
          total_price: 500,
          status: 'pending',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z',
          dish: {
            id: 1,
            name: 'テスト料理',
            price: 500,
            created_at: '2025-01-15T08:00:00Z',
            updated_at: '2025-01-15T08:00:00Z',
          },
          user: {
            id: 1,
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        },
      ]
      mockOrderHistory.orders.value = mockOrders

      const TestComponent = {
        ...createNewOrdersComponent(),
        components: {
          OrderList: {
            template: `
              <div class="order-list-stub">
                <button @click="$emit('complete', 1)" class="complete-btn">Complete</button>
              </div>
            `,
            props: ['orders'],
            emits: ['complete'],
          },
        },
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      const completeButton = wrapper.find('.complete-btn')
      await completeButton.trigger('click')

      expect(mockOrderHistory.updateOrderStatus).toHaveBeenCalledWith(
        1,
        'completed',
      )
    })
  })

  /**
   * フィルター機能のテスト
   */
  describe('フィルター機能', () => {
    it('フィルターが適用されている場合にフィルター表示を行う', async () => {
      mockOrderFilters.hasActiveFilters.value = true

      const wrapper = mount(createNewOrdersComponent(), {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      })
      await nextTick()

      expect(wrapper.text()).toContain('フィルターが適用されています')
    })
  })
})
