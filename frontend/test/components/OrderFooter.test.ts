import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderFooter from '~/components/OrderFooter.vue'
import type { Order } from '~/types/schemas'

/**
 * OrderFooter.vue のテスト
 * 責任: 時刻・アクションボタンの表示グループ
 */
describe('OrderFooter', () => {
  const mockOrder: Order = {
    id: 1,
    user_id: 10,
    dish_id: 5,
    quantity: 2,
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
    total_price: 0,
  }

  describe('タイムスタンプの表示', () => {
    it('OrderTimestampコンポーネントが表示される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const timestamp = wrapper.findComponent({ name: 'OrderTimestamp' })
      expect(timestamp.exists()).toBe(true)
      expect(timestamp.props('createdAt')).toBe('2024-01-15T10:30:00Z')
    })
  })

  describe('アクションボタンの表示', () => {
    it('pendingステータスの場合に提供済みボタンを表示する', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.exists()).toBe(true)
      expect(completeButton.text()).toBe('提供済み')
    })

    it('preparingステータスの場合に提供済みボタンを表示する', () => {
      const preparingOrder: Order = {
        ...mockOrder,
        status: 'preparing',
      }

      const wrapper = mount(OrderFooter, {
        props: { order: preparingOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.exists()).toBe(true)
      expect(completeButton.text()).toBe('提供済み')
    })

    it('completedステータスの場合にボタンを表示しない', () => {
      const completedOrder: Order = {
        ...mockOrder,
        status: 'completed',
      }

      const wrapper = mount(OrderFooter, {
        props: { order: completedOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.exists()).toBe(false)
    })

    it('cancelledステータスの場合にボタンを表示しない', () => {
      const cancelledOrder: Order = {
        ...mockOrder,
        status: 'cancelled',
      }

      const wrapper = mount(OrderFooter, {
        props: { order: cancelledOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.exists()).toBe(false)
    })

    it('提供済みボタンに適切なARIAラベルが設定される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.attributes('aria-label')).toBe('ハンバーグ定食を提供済みにする')
    })

    it('提供済みボタンにアイコンが表示される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const buttonIcon = wrapper.find('button svg')
      expect(buttonIcon.exists()).toBe(true)
      expect(buttonIcon.attributes('viewBox')).toBe('0 0 24 24')
    })
  })

  describe('イベント発火', () => {
    it('提供済みボタンクリック時にupdateStatusイベントを発火する', async () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const completeButton = wrapper.find('button')
      await completeButton.trigger('click')

      const emittedEvents = wrapper.emitted('updateStatus')
      expect(emittedEvents).toBeTruthy()
      expect(emittedEvents![0]).toEqual([1, 'completed'])
    })
  })

  describe('レイアウトとスタイル', () => {
    it('左右に要素を配置するレイアウト構造を持つ', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const container = wrapper.find('.flex.items-center.justify-between')
      expect(container.exists()).toBe(true)
    })

    it('上部にボーダーを持つ', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const container = wrapper.find('.border-t.border-gray-100')
      expect(container.exists()).toBe(true)
    })

    it('適切なパディングが設定される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const container = wrapper.find('.pt-3')
      expect(container.exists()).toBe(true)
    })

    it('提供済みボタンに適切なスタイルが適用される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.classes()).toContain('bg-green-600')
      expect(completeButton.classes()).toContain('text-white')
      expect(completeButton.classes()).toContain('rounded-lg')
    })
  })

  describe('アクセシビリティ', () => {
    it('ボタンのアイコンが装飾的要素として適切にマークされる', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const buttonIcon = wrapper.find('button svg')
      expect(buttonIcon.attributes('aria-hidden')).toBe('true')
    })

    it('フォーカス管理のクラスが適用される', () => {
      const wrapper = mount(OrderFooter, {
        props: { order: mockOrder },
      })

      const completeButton = wrapper.find('button')
      expect(completeButton.classes()).toContain('focus:outline-none')
      expect(completeButton.classes()).toContain('focus:ring-2')
      expect(completeButton.classes()).toContain('focus:ring-green-500')
    })
  })
})
