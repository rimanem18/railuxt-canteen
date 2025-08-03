import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderItemEmpty from '~/components/OrderItemEmpty.vue'

describe('OrderItemEmpty', () => {
  it('コンポーネントが正常にマウントできる', () => {
    const wrapper = mount(OrderItemEmpty)
    expect(wrapper.exists()).toBe(true)
  })

  it('空状態のメッセージが表示される', () => {
    const wrapper = mount(OrderItemEmpty)
    expect(wrapper.text()).toContain('注文はありません')
  })

  it('適切なARIAロールが設定されている', () => {
    const wrapper = mount(OrderItemEmpty)
    const container = wrapper.find('[role="status"]')
    expect(container.exists()).toBe(true)
    expect(container.attributes('aria-live')).toBe('polite')
  })

  it('アイコンが表示される', () => {
    const wrapper = mount(OrderItemEmpty)
    const icon = wrapper.find('svg')
    expect(icon.exists()).toBe(true)
  })

  it('適切なCSSクラスが適用されている', () => {
    const wrapper = mount(OrderItemEmpty)
    const container = wrapper.find('.text-center.py-12')
    expect(container.exists()).toBe(true)
  })

  it('アクセシビリティを考慮したマークアップになっている', () => {
    const wrapper = mount(OrderItemEmpty)
    const statusElement = wrapper.find('[role="status"]')
    expect(statusElement.exists()).toBe(true)

    const ariaLive = statusElement.attributes('aria-live')
    expect(ariaLive).toBe('polite')
  })
})
