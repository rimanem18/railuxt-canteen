import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorDisplay from '~/components/ErrorDisplay.vue'

describe('ErrorDisplay', () => {
  describe('基本表示機能', () => {
    it('エラー情報が null の場合は表示しない', () => {
      const wrapper = mount(ErrorDisplay, {
        props: {
          error: null,
        },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })

    it('エラーメッセージを正しく表示する', () => {
      const error = {
        message: 'テストエラーメッセージ',
      }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
        },
      })

      expect(wrapper.text()).toContain('テストエラーメッセージ')
    })

    it('詳細エラーメッセージも表示する', () => {
      const error = {
        message: 'メインエラー',
        details: '詳細エラー情報',
      }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
        },
      })

      expect(wrapper.text()).toContain('メインエラー')
      expect(wrapper.text()).toContain('詳細エラー情報')
    })
  })

  describe('バリアント機能（OCP原則）', () => {
    it('error バリアントで正しいクラスを適用する', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          variant: 'error',
        },
      })

      const errorDiv = wrapper.find('[role="alert"]')
      expect(errorDiv.classes()).toContain('bg-red-50')
      expect(errorDiv.classes()).toContain('border-red-200')
      expect(errorDiv.classes()).toContain('text-red-800')
    })

    it('warning バリアントで正しいクラスを適用する', () => {
      const error = { message: '警告' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          variant: 'warning',
        },
      })

      const errorDiv = wrapper.find('[role="alert"]')
      expect(errorDiv.classes()).toContain('bg-yellow-50')
      expect(errorDiv.classes()).toContain('border-yellow-200')
      expect(errorDiv.classes()).toContain('text-yellow-800')
    })

    it('info バリアントで正しいクラスを適用する', () => {
      const error = { message: '情報' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          variant: 'info',
        },
      })

      const errorDiv = wrapper.find('[role="alert"]')
      expect(errorDiv.classes()).toContain('bg-blue-50')
      expect(errorDiv.classes()).toContain('border-blue-200')
      expect(errorDiv.classes()).toContain('text-blue-800')
    })
  })

  describe('閉じる機能', () => {
    it('dismissible=true の場合は閉じるボタンを表示する', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          dismissible: true,
        },
      })

      const closeButton = wrapper.find('button[aria-label*="閉じる"]')
      expect(closeButton.exists()).toBe(true)
    })

    it('dismissible=false の場合は閉じるボタンを表示しない', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          dismissible: false,
        },
      })

      const closeButton = wrapper.find('button[aria-label*="閉じる"]')
      expect(closeButton.exists()).toBe(false)
    })

    it('閉じるボタンをクリックすると dismiss イベントが発火する', async () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          dismissible: true,
        },
      })

      const closeButton = wrapper.find('button[aria-label*="閉じる"]')
      await closeButton.trigger('click')

      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })
  })

  describe('アクセシビリティ', () => {
    it('role="alert" を設定している', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
        },
      })

      const errorDiv = wrapper.find('[role="alert"]')
      expect(errorDiv.exists()).toBe(true)
    })

    it('aria-live="polite" を設定している', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
        },
      })

      const errorDiv = wrapper.find('[aria-live="polite"]')
      expect(errorDiv.exists()).toBe(true)
    })

    it('閉じるボタンに適切な aria-label を設定している', () => {
      const error = { message: 'テストエラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
          dismissible: true,
        },
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('aria-label')).toBe('エラーメッセージを閉じる: テストエラー')
    })
  })

  describe('スロット機能（拡張性）', () => {
    it('actions スロットがない場合はアクション領域を表示しない', () => {
      const error = { message: 'エラー' }

      const wrapper = mount(ErrorDisplay, {
        props: {
          error,
        },
      })

      const actionsDiv = wrapper.find('.border-t')
      expect(actionsDiv.exists()).toBe(false)
    })
  })
})
