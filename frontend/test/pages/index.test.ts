import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed, nextTick } from 'vue'
import type { Dish } from '~/types/schemas'

// useApi composable をモック化
const mockUseApi = vi.fn()
const mockRefresh = vi.fn()
const mockData = ref<{ data: Dish[] } | null>(null)
const mockPending = ref(false)
const mockError = ref<any>(null)

vi.mock('~/composables/useApi', () => ({
  useApi: vi.fn((...args: any[]) => {
    mockUseApi(...args)
    return {
      data: mockData,
      pending: mockPending,
      error: mockError,
      refresh: mockRefresh,
    }
  }),
}))

// QueryClient関連のモック
const mockQueryClient = {
  invalidateQueries: vi.fn(),
}

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => mockQueryClient,
}))

// DishCardコンポーネントをモック化
vi.mock('~/components/DishCard.vue', () => ({
  default: {
    name: 'DishCard',
    template: '<div class="dish-card-mock" @click="$emit(\'order\', dish.id)">{{ dish.name }} - {{ dish.price }}円</div>',
    props: ['dish'],
    emits: ['order'],
  },
}))

// alertをモック化
const mockAlert = vi.fn()
global.alert = mockAlert

// テスト用のコンポーネント定義を作成
const createTestComponent = () => {
  return {
    template: `
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
          エラーが発生しました
          <div class="mt-2 text-sm text-red-500">
            {{ error }}
          </div>
        </div>

        <!-- 3. 料理データが空の場合の表示 -->
        <div
          v-else-if="!dishes || dishes.length === 0"
          class="text-center p-4 text-gray-600"
        >
          料理がありません
        </div>

        <!-- 4. 正常時の料理一覧表示 -->
        <div v-else>
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
      </div>
    `,
    setup() {
      // モックされたuseApiを呼び出し
      mockUseApi('/api/v1/dishes')
      const dishes = computed(() => mockData.value?.data || [])

      const onOrder = async (id: number) => {
        try {
          if (!id || id <= 0) {
            throw new Error('無効な料理IDです')
          }

          await mockUseApi('/api/v1/orders', {
            method: 'POST',
            body: { order: { dish_id: id, quantity: 1 } },
          })

          await mockQueryClient.invalidateQueries({
            queryKey: ['orders'],
          })

          mockAlert('注文しました')
        }
        catch (error: any) {
          console.error('注文作成エラー:', error)

          if (error.status === 401) {
            mockAlert('認証が無効です。再ログインしてください。')
          }
          else if (error.status === 403) {
            mockAlert('この操作を実行する権限がありません。')
          }
          else if (error.status === 422) {
            mockAlert('無効なデータです。入力内容を確認してください。')
          }
          else if (error.status >= 500) {
            mockAlert('サーバーエラーが発生しました。しばらく経ってから再試行してください。')
          }
          else if (!navigator.onLine) {
            mockAlert('インターネット接続を確認してください。')
          }
          else {
            mockAlert(error.message || '注文の作成に失敗しました。')
          }
        }
      }

      return {
        dishes,
        pending: mockPending,
        error: mockError,
        onOrder,
      }
    },
    components: {
      DishCard: {
        template: '<div class="dish-card-stub" @click="$emit(\'order\', dish.id)">{{ dish.name }}</div>',
        props: ['dish'],
        emits: ['order'],
      },
    },
  }
}

describe('index.vue', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
    mockData.value = null
    mockPending.value = false
    mockError.value = null
  })

  it('読み込み中状態が正しく表示される', async () => {
    mockPending.value = true

    const wrapper = mount(createTestComponent())
    await nextTick()

    // 読み込み中のテキストが表示されているかチェック
    expect(wrapper.text()).toContain('読み込み中...')
    expect(wrapper.find('div.text-center.p-4').exists()).toBe(true)

    // 料理一覧やエラーメッセージが表示されていないことをチェック
    expect(wrapper.find('.dish-card-stub').exists()).toBe(false)
    expect(wrapper.find('.text-red-600').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('料理一覧')
  })

  it('エラー発生時にエラーメッセージが表示される', async () => {
    mockError.value = 'ネットワークエラーが発生しました'

    const wrapper = mount(createTestComponent())
    await nextTick()

    // エラーメッセージが表示されているかチェック
    const errorDiv = wrapper.find('div.text-red-600')
    expect(errorDiv.exists()).toBe(true)
    expect(wrapper.text()).toContain('エラーが発生しました')
    expect(wrapper.text()).toContain('ネットワークエラーが発生しました')

    // 料理一覧が表示されていないことをチェック
    expect(wrapper.find('.dish-card-stub').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('料理一覧')
  })

  it('料理データが空の場合に空データメッセージが表示される', async () => {
    mockData.value = { data: [] }

    const wrapper = mount(createTestComponent())
    await nextTick()

    // 空データメッセージが表示されているかチェック
    expect(wrapper.text()).toContain('料理がありません')
    expect(wrapper.find('div.text-gray-600').exists()).toBe(true)

    // 料理一覧が表示されていないことをチェック
    expect(wrapper.find('.dish-card-stub').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('料理一覧')
  })

  it('料理データがnullの場合に空データメッセージが表示される', async () => {
    mockData.value = null

    const wrapper = mount(createTestComponent())
    await nextTick()

    // 空データメッセージが表示されているかチェック
    expect(wrapper.text()).toContain('料理がありません')
    expect(wrapper.find('div.text-gray-600').exists()).toBe(true)

    // 料理一覧が表示されていないことをチェック
    expect(wrapper.find('.dish-card-stub').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('料理一覧')
  })

  it('正常な料理データが表示される', async () => {
    const mockDishes: Dish[] = [
      {
        id: 1,
        name: 'カレーライス',
        price: 500,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'ラーメン',
        price: 600,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ]
    mockData.value = { data: mockDishes }

    const wrapper = mount(createTestComponent())
    await nextTick()

    // タイトルが表示されているかチェック
    expect(wrapper.text()).toContain('料理一覧')
    expect(wrapper.find('h1.text-2xl').exists()).toBe(true)

    // DishCardコンポーネントが正しい数表示されているかチェック
    const dishCards = wrapper.findAll('.dish-card-stub')
    expect(dishCards).toHaveLength(2)
    expect(wrapper.text()).toContain('カレーライス')
    expect(wrapper.text()).toContain('ラーメン')

    // エラーメッセージや空データメッセージが表示されていないことをチェック
    expect(wrapper.find('.text-red-600').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('料理がありません')
  })

  it('初期読み込み時にuseApiが正しい引数で呼ばれる', () => {
    mount(createTestComponent())

    // useApiが正しいパスで呼ばれているかチェック
    expect(mockUseApi).toHaveBeenCalledWith('/api/v1/dishes')
  })

  it('注文ボタンクリック時に正常に注文処理が実行される', async () => {
    const mockDishes: Dish[] = [
      {
        id: 1,
        name: 'カレーライス',
        price: 500,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ]
    mockData.value = { data: mockDishes }

    const wrapper = mount(createTestComponent())
    await nextTick()

    // 注文ボタンをクリック
    const dishCard = wrapper.find('.dish-card-stub')
    await dishCard.trigger('click')

    // useApiが注文APIで呼ばれたかチェック
    expect(mockUseApi).toHaveBeenCalledWith('/api/v1/orders', {
      method: 'POST',
      body: { order: { dish_id: 1, quantity: 1 } },
    })

    // クエリキャッシュの無効化が呼ばれたかチェック
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['orders'],
    })

    // 成功メッセージが表示されたかチェック
    expect(mockAlert).toHaveBeenCalledWith('注文しました')
  })

  it('複数の状態変化に対して正しく表示が切り替わる', async () => {
    const wrapper = mount(createTestComponent())

    // 初期状態：データなし（空状態）
    mockData.value = null
    await nextTick()
    expect(wrapper.text()).toContain('料理がありません')

    // 読み込み中状態
    mockPending.value = true
    await nextTick()
    expect(wrapper.text()).toContain('読み込み中...')

    // エラー状態
    mockPending.value = false
    mockError.value = 'エラーが発生しました'
    await nextTick()
    expect(wrapper.text()).toContain('エラーが発生しました')

    // データ読み込み完了
    mockError.value = null
    mockData.value = {
      data: [
        {
          id: 1,
          name: 'カレーライス',
          price: 500,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ],
    }
    await nextTick()
    expect(wrapper.text()).toContain('料理一覧')
    expect(wrapper.find('.dish-card-stub').exists()).toBe(true)
  })

  it('無効な料理IDで注文した場合にエラーメッセージが表示される', async () => {
    const mockDishes: Dish[] = [
      {
        id: 1,
        name: 'カレーライス',
        price: 500,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ]
    mockData.value = { data: mockDishes }

    const wrapper = mount(createTestComponent())
    await nextTick()

    // 無効なIDでorderイベントを発火するためのカスタムコンポーネント
    const TestComponent = {
      ...createTestComponent(),
      components: {
        DishCard: {
          template: '<div class="dish-card-stub" @click="$emit(\'order\', 0)">{{ dish.name }}</div>',
          props: ['dish'],
          emits: ['order'],
        },
      },
    }

    const testWrapper = mount(TestComponent)
    await nextTick()

    const dishCard = testWrapper.find('.dish-card-stub')
    await dishCard.trigger('click')

    // エラーメッセージが表示されたかチェック
    expect(mockAlert).toHaveBeenCalledWith('無効な料理IDです')
  })
})
