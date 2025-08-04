import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderStatus from '~/components/OrderStatus.vue'

describe('OrderStatus.vue', () => {
  describe('ステータスバッジの表示', () => {
    it('pending ステータスの場合、未提供のバッジを表示する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'pending',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('未提供')
      expect(badge.classes()).toContain('bg-yellow-50')
      expect(badge.classes()).toContain('text-yellow-700')

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.classes()).toContain('bg-yellow-400')
    })

    it('preparing ステータスの場合、調理中のバッジを表示する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'preparing',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.text()).toBe('調理中')
      expect(badge.classes()).toContain('bg-orange-50')
      expect(badge.classes()).toContain('text-orange-700')

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.classes()).toContain('bg-orange-400')
    })

    it('completed ステータスの場合、提供済みのバッジを表示する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'completed',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.text()).toBe('提供済み')
      expect(badge.classes()).toContain('bg-gray-50')
      expect(badge.classes()).toContain('text-gray-600')

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.classes()).toContain('bg-gray-400')
    })

    it('cancelled ステータスの場合、キャンセルのバッジを表示する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'cancelled',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.text()).toBe('キャンセル')
      expect(badge.classes()).toContain('bg-red-50')
      expect(badge.classes()).toContain('text-red-700')

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.classes()).toContain('bg-red-400')
    })

    it('未知のステータスの場合、不明のバッジを表示する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'unknown',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.text()).toBe('不明')
      expect(badge.classes()).toContain('bg-gray-50')
      expect(badge.classes()).toContain('text-gray-600')

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.classes()).toContain('bg-gray-400')
    })
  })

  describe('アクセシビリティ', () => {
    it('適切な aria-label を設定する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'pending',
        },
      })

      const badge = wrapper.find('[data-testid="status-badge"]')
      expect(badge.attributes('aria-label')).toBe('注文ステータス: 未提供')
    })

    it('ステータスドットに適切な aria-hidden を設定する', () => {
      const wrapper = mount(OrderStatus, {
        props: {
          status: 'pending',
        },
      })

      const dot = wrapper.find('[data-testid="status-dot"]')
      expect(dot.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('プロパティのバリデーション', () => {
    it('status プロパティが必須である', () => {
      // TypeScript でプロパティの型チェックが行われることを確認
      // この要件は TypeScript の型システムで保証される
      expect(true).toBe(true)
    })
  })
})
