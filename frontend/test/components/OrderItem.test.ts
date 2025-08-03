import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderItem from '~/components/OrderItem.vue'
import type { Order } from '~/types/schemas'

/**
 * OrderItem.vue のテスト
 * 責任: 単一注文アイテムの全体表示制御
 */
describe('OrderItem', () => {
  const mockOrder: Order = {
    id: 1,
    user_id: 10,
    dish_id: 5,
    quantity: 2,
    total_price: 1600,
    status: 'pending',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    dish: {
      id: 5,
      name: 'ハンバーグ定食',
      price: 800,
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z',
    },
    user: {
      id: 10,
      name: '田中太郎',
      email: 'tanaka@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  }

  describe('コンポーネント統合', () => {
    it('OrderHeaderコンポーネントが表示される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const header = wrapper.findComponent({ name: 'OrderHeader' })
      expect(header.exists()).toBe(true)
      expect(header.props('order')).toEqual(mockOrder)
    })

    it('OrderStatusコンポーネントが表示される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const status = wrapper.findComponent({ name: 'OrderStatus' })
      expect(status.exists()).toBe(true)
      expect(status.props('status')).toBe('pending')
    })

    it('OrderFooterコンポーネントが表示される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const footer = wrapper.findComponent({ name: 'OrderFooter' })
      expect(footer.exists()).toBe(true)
      expect(footer.props('order')).toEqual(mockOrder)
    })
  })

  describe('レイアウト構造', () => {
    it('適切なカード構造を持つ', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('.bg-white.rounded-xl.shadow-sm')
      expect(card.exists()).toBe(true)
    })

    it('ホバー効果のクラスが設定される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('li')
      expect(card.classes()).toContain('hover:shadow-lg')
      expect(card.classes()).toContain('hover:border-gray-200')
      expect(card.classes()).toContain('hover:-translate-y-0.5')
    })

    it('フォーカス管理のクラスが設定される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('li')
      expect(card.classes()).toContain('focus-within:ring-2')
      expect(card.classes()).toContain('focus-within:ring-blue-500')
      expect(card.classes()).toContain('focus-within:ring-offset-2')
    })

    it('メイン情報エリアが適切にレイアウトされる', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const mainArea = wrapper.find('.flex.flex-col.gap-4')
      expect(mainArea.exists()).toBe(true)
    })

    it('ヘッダーエリアが左右レイアウトを持つ', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const headerLayout = wrapper.find('.flex.items-start.justify-between')
      expect(headerLayout.exists()).toBe(true)
    })

    it('ステータスが右側に配置される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const statusContainer = wrapper.find('.flex-shrink-0')
      expect(statusContainer.exists()).toBe(true)
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIAラベルが設定される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('li')
      expect(card.attributes('aria-label')).toBe('ハンバーグ定食の注文')
    })

    it('tabindex属性が設定される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('li')
      expect(card.attributes('tabindex')).toBe('0')
    })

    it('role属性が設定される', () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const card = wrapper.find('li')
      expect(card.attributes('role')).toBe('article')
    })
  })

  describe('イベント伝播', () => {
    it('OrderFooterからのupdateStatusイベントが適切に伝播される', async () => {
      const wrapper = mount(OrderItem, {
        props: { order: mockOrder },
      })

      const footer = wrapper.findComponent({ name: 'OrderFooter' })
      await footer.vm.$emit('updateStatus', 1, 'completed')

      const emittedEvents = wrapper.emitted('updateStatus')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents![0]).toEqual([1, 'completed'])
    })
  })

  describe('異なる注文ステータス', () => {
    it('completedステータスの注文を適切に表示する', () => {
      const completedOrder: Order = {
        ...mockOrder,
        status: 'completed',
      }

      const wrapper = mount(OrderItem, {
        props: { order: completedOrder },
      })

      const status = wrapper.findComponent({ name: 'OrderStatus' })
      expect(status.props('status')).toBe('completed')
    })

    it('preparingステータスの注文を適切に表示する', () => {
      const preparingOrder: Order = {
        ...mockOrder,
        status: 'preparing',
      }

      const wrapper = mount(OrderItem, {
        props: { order: preparingOrder },
      })

      const status = wrapper.findComponent({ name: 'OrderStatus' })
      expect(status.props('status')).toBe('preparing')
    })
  })

  describe('ユーザー情報の表示', () => {
    it('ユーザー情報がない注文を適切に表示する', () => {
      const orderWithoutUser: Order = {
        ...mockOrder,
        user: undefined,
      }

      const wrapper = mount(OrderItem, {
        props: { order: orderWithoutUser },
      })

      const header = wrapper.findComponent({ name: 'OrderHeader' })
      expect(header.props('order')).toEqual(orderWithoutUser)
    })
  })
})
