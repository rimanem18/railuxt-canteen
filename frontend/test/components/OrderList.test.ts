import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderList from '~/components/OrderList.vue'
import type { Order } from '~/types/schemas'

describe('OrderList.vue', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
  })

  it('注文リストの基本構造が表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 2,
        total_price: 1000,
        status: 'pending',
        created_at: '2024-07-31T14:00:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // リスト構造が存在するかチェック
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.find('li').exists()).toBe(true)

    // 注文情報が表示されているかチェック
    expect(wrapper.text()).toContain('カレーライス')
    expect(wrapper.text()).toContain('× 2')
  })

  it('空の注文リストでも正常に表示される', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: [],
      },
    })

    // リスト構造は存在するが、アイテムは存在しない
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.find('li').exists()).toBe(false)

    // 空状態メッセージが表示される
    expect(wrapper.text()).toContain('注文はありません')
  })

  it('提供済み注文では提供済みマークが表示され、ボタンが非表示になる', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'completed',
        created_at: '2024-07-31T13:30:00.000Z',
        dish: {
          id: 1,
          name: 'ラーメン',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 提供済みステータスが表示されているかチェック
    const statusText = wrapper.find('.bg-gray-50')
    expect(statusText.exists()).toBe(true)
    expect(statusText.text()).toContain('提供済み')

    // 提供済みボタンが表示されていないことをチェック
    const completeButton = wrapper.find('button.bg-green-600')
    expect(completeButton.exists()).toBe(false)
  })

  it('未提供注文では提供済みボタンが表示され、提供済みマークが非表示になる', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:15:00.000Z',
        dish: {
          id: 1,
          name: 'ラーメン',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 提供済みボタンが表示されているかチェック
    const completeButton = wrapper.find('button.bg-green-600')
    expect(completeButton.exists()).toBe(true)
    expect(completeButton.text()).toContain('提供済み')

    // 時刻表示は存在するが、提供済みマークは特定のクラスで識別されない
    // ステータスが'未提供'であることを確認
    const statusText = wrapper.find('.bg-yellow-50')
    expect(statusText.exists()).toBe(true)
    expect(statusText.text()).toContain('未提供')
  })

  it('提供済みボタンをクリックするとcompleteイベントが発火される', async () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:20:00.000Z',
        dish: {
          id: 1,
          name: 'ラーメン',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 提供済みボタンをクリック
    const completeButton = wrapper.find('button.bg-green-600')
    await completeButton.trigger('click')

    // updateStatusイベントが発火されたかチェック
    expect(wrapper.emitted('updateStatus')).toBeTruthy()
    expect(wrapper.emitted('updateStatus')).toHaveLength(1)
    expect(wrapper.emitted('updateStatus')![0]).toEqual([1, 'completed'])
  })

  it('複数の注文が混在している場合の表示が正しい', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'completed',
        created_at: '2024-07-31T13:45:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
      },
      {
        id: 2,
        user_id: 1,
        dish_id: 2,
        quantity: 2,
        total_price: 800,
        status: 'pending',
        created_at: '2024-07-31T14:25:00.000Z',
        dish: {
          id: 2,
          name: 'ラーメン',
          price: 400,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 2つのアイテムが表示されているかチェック
    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(2)

    // 提供済み注文の確認
    expect(wrapper.text()).toContain('カレーライス')
    expect(wrapper.text()).toContain('提供済み')

    // 未提供注文の確認
    expect(wrapper.text()).toContain('ラーメン')
    expect(wrapper.text()).toContain('× 2')

    // ボタンは未提供の注文のみに存在
    const completeButtons = wrapper.findAll('button.bg-green-600')
    expect(completeButtons).toHaveLength(1)
  })

  it('準備中ステータスでも提供済みボタンが表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'preparing',
        created_at: '2024-07-31T14:10:00.000Z',
        dish: {
          id: 1,
          name: 'ラーメン',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 準備中ステータスでも提供済みボタンが表示される
    const completeButton = wrapper.find('button.bg-green-600')
    expect(completeButton.exists()).toBe(true)

    // 準備中ステータスが表示されていることを確認
    const statusText = wrapper.find('.bg-orange-50')
    expect(statusText.exists()).toBe(true)
    expect(statusText.text()).toContain('調理中')
  })

  it('料理名と数量が正しくフォーマットされて表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 5,
        total_price: 2500,
        status: 'pending',
        created_at: '2024-07-31T12:00:00.000Z',
        dish: {
          id: 1,
          name: '特製ハンバーグ定食',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 料理名が太字で表示される
    const dishName = wrapper.find('h3.font-bold')
    expect(dishName.exists()).toBe(true)
    expect(dishName.text()).toBe('特製ハンバーグ定食')

    // 数量がバッジで表示される
    const quantity = wrapper.find('span.bg-blue-50')
    expect(quantity.exists()).toBe(true)
    expect(quantity.text()).toBe('× 5')
  })

  it('注文時刻が正しく表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:00:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 時刻表示が存在することを確認
    const timeText = wrapper.find('time')
    expect(timeText.exists()).toBe(true)
    // 具体的な時刻フォーマットは useFormatDateTime のテストで検証済み
    expect(timeText.text()).not.toBe('')
    expect(timeText.text()).not.toBe('-')
  })

  it('created_atがundefinedの場合でも正常に表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: undefined,
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 時刻表示が'-'となることを確認
    const timeText = wrapper.find('time')
    expect(timeText.exists()).toBe(true)
    expect(timeText.text()).toBe('-')
  })

  it('注文者の名前が表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:00:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
        user: {
          id: 1,
          name: '注文太郎',
          email: 'test@example.com',
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 注文者名が表示されることを確認
    const userNameElement = wrapper.find('[data-testid="order-user-name"]')
    expect(userNameElement.exists()).toBe(true)
    expect(userNameElement.text()).toContain('注文太郎')
  })

  it('ユーザー情報がない場合は注文者名が表示されない', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:00:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
        // userプロパティなし
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 注文者名要素が存在しないことを確認
    const userNameElement = wrapper.find('[data-testid="order-user-name"]')
    expect(userNameElement.exists()).toBe(false)
  })

  it('ユーザー名がない場合は「名前なし」と表示される', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        user_id: 1,
        dish_id: 1,
        quantity: 1,
        total_price: 500,
        status: 'pending',
        created_at: '2024-07-31T14:00:00.000Z',
        dish: {
          id: 1,
          name: 'カレーライス',
          price: 500,
        },
        user: {
          id: 1,
          name: '', // 空の名前
          email: 'test@example.com',
        },
      },
    ]

    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    // 「名前なし」が表示されることを確認
    const userNameElement = wrapper.find('[data-testid="order-user-name"]')
    expect(userNameElement.exists()).toBe(true)
    expect(userNameElement.text()).toContain('名前なし')
  })
})
