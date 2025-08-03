import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderHeader from '~/components/OrderHeader.vue'
import type { Order } from '~/types/schemas'

/**
 * OrderHeader.vue のテスト
 * 責任: 料理名・数量・注文者情報の表示グループ
 */
describe('OrderHeader', () => {
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

  describe('料理情報の表示', () => {
    it('料理名を正しく表示する', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const dishName = wrapper.find('h3')
      expect(dishName.text()).toBe('ハンバーグ定食')
      expect(dishName.classes()).toContain('text-xl')
      expect(dishName.classes()).toContain('font-bold')
    })

    it('数量を正しく表示する', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const quantityBadge = wrapper.find('[aria-label="注文数量: 2個"]')
      expect(quantityBadge.exists()).toBe(true)
      expect(quantityBadge.text()).toBe('× 2')
    })

    it('数量バッジに適切なスタイルが適用される', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const quantityBadge = wrapper.find('[aria-label="注文数量: 2個"]')
      expect(quantityBadge.classes()).toContain('bg-blue-50')
      expect(quantityBadge.classes()).toContain('text-blue-700')
    })
  })

  describe('注文者情報の表示', () => {
    it('注文者名を正しく表示する', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const userSection = wrapper.find('[data-testid="order-user-name"]')
      expect(userSection.exists()).toBe(true)
      expect(userSection.text()).toBe('田中太郎')
    })

    it('注文者情報にアイコンを表示する', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const userIcon = wrapper.find('svg')
      expect(userIcon.exists()).toBe(true)
      expect(userIcon.attributes('viewBox')).toBe('0 0 24 24')
    })

    it('注文者がnullの場合は注文者情報を表示しない', () => {
      const orderWithoutUser: Order = {
        ...mockOrder,
        user: undefined,
      }

      const wrapper = mount(OrderHeader, {
        props: { order: orderWithoutUser },
      })

      const userSection = wrapper.find('[data-testid="order-user-name"]')
      expect(userSection.exists()).toBe(false)
    })

    it('注文者のアクセシビリティラベルが正しく設定される', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const userGroup = wrapper.find('[role="group"]')
      expect(userGroup.attributes('aria-label')).toBe('注文者: 田中太郎')
    })
  })

  describe('レイアウトとスタイル', () => {
    it('左右のレイアウト構造を持つ', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const container = wrapper.find('.flex.items-start.justify-between')
      expect(container.exists()).toBe(true)
    })

    it('左側に料理情報とメタデータが配置される', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const leftSection = wrapper.find('.flex-1.min-w-0')
      expect(leftSection.exists()).toBe(true)
    })

    it('料理名が長い場合にtruncateされる', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const dishName = wrapper.find('h3')
      expect(dishName.classes()).toContain('truncate')
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIAラベルが設定される', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      // 数量のARIAラベル
      const quantityBadge = wrapper.find('[aria-label="注文数量: 2個"]')
      expect(quantityBadge.exists()).toBe(true)

      // 注文者のARIAラベル
      const userGroup = wrapper.find('[aria-label="注文者: 田中太郎"]')
      expect(userGroup.exists()).toBe(true)
    })

    it('アイコンが装飾的要素として適切にマークされる', () => {
      const wrapper = mount(OrderHeader, {
        props: { order: mockOrder },
      })

      const icon = wrapper.find('svg')
      expect(icon.attributes('aria-hidden')).toBe('true')
    })
  })
})
