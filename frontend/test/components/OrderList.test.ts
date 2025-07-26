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

    // 提供済みマークが表示されているかチェック
    const completedText = wrapper.find('span.text-gray-500')
    expect(completedText.exists()).toBe(true)
    expect(completedText.text()).toBe('(提供済み)')

    // 提供済みボタンが表示されていないことをチェック
    const completeButton = wrapper.find('button.bg-green-500')
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
    const completeButton = wrapper.find('button.bg-green-500')
    expect(completeButton.exists()).toBe(true)
    expect(completeButton.text()).toBe('提供済みにする')

    // 提供済みマークが表示されていないことをチェック
    const completedText = wrapper.find('span.text-gray-500')
    expect(completedText.exists()).toBe(false)
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
    const completeButton = wrapper.find('button.bg-green-500')
    await completeButton.trigger('click')

    // completeイベントが発火されたかチェック
    expect(wrapper.emitted('complete')).toBeTruthy()
    expect(wrapper.emitted('complete')).toHaveLength(1)
    expect(wrapper.emitted('complete')![0]).toEqual([1])
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
    expect(wrapper.text()).toContain('(提供済み)')

    // 未提供注文の確認
    expect(wrapper.text()).toContain('ラーメン')
    expect(wrapper.text()).toContain('× 2')

    // ボタンは未提供の注文のみに存在
    const completeButtons = wrapper.findAll('button.bg-green-500')
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
    const completeButton = wrapper.find('button.bg-green-500')
    expect(completeButton.exists()).toBe(true)

    // 提供済みマークは表示されない
    const completedText = wrapper.find('span.text-gray-500')
    expect(completedText.exists()).toBe(false)
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
    const dishName = wrapper.find('span.font-medium')
    expect(dishName.exists()).toBe(true)
    expect(dishName.text()).toBe('特製ハンバーグ定食')

    // 数量がグレーのテキストで表示される
    const quantity = wrapper.find('span.text-gray-600')
    expect(quantity.exists()).toBe(true)
    expect(quantity.text()).toBe('× 5')
  })
})
