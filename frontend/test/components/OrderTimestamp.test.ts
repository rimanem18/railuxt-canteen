import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderTimestamp from '~/components/OrderTimestamp.vue'

describe('OrderTimestamp', () => {
  const mockCreatedAt = '2023-12-25T10:30:00.000Z'

  it('コンポーネントが正常にマウントできる', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('時刻アイコンが表示される', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    const icon = wrapper.find('svg')
    expect(icon.exists()).toBe(true)
  })

  it('timeタグが適切に設定されている', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    const timeElement = wrapper.find('time')
    expect(timeElement.exists()).toBe(true)
    expect(timeElement.attributes('datetime')).toBe(mockCreatedAt)
  })

  it('フォントが medium に設定されている', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    const timeElement = wrapper.find('time')
    expect(timeElement.classes()).toContain('font-medium')
  })

  it('適切なCSSクラスが適用されている', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    const container = wrapper.find('.flex.items-center.text-sm.text-gray-500')
    expect(container.exists()).toBe(true)
  })

  it('アクセシビリティを考慮したアイコンになっている', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    const icon = wrapper.find('svg')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('propsが適切に型定義されている', () => {
    const wrapper = mount(OrderTimestamp, {
      props: {
        createdAt: mockCreatedAt,
      },
    })
    // propsが正しく渡されていることを確認
    expect(wrapper.props().createdAt).toBe(mockCreatedAt)
  })
})
