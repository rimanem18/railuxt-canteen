import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DebugLogin from '~/components/DebugLogin.vue'

describe('DebugLogin.vue', () => {
  let mockEmailInput: HTMLInputElement
  let mockPasswordInput: HTMLInputElement
  let mockLoginButton: HTMLButtonElement

  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()

    // DOMの模擬フォーム要素を作成
    mockEmailInput = document.createElement('input') as HTMLInputElement
    mockEmailInput.type = 'email'
    mockEmailInput.value = ''
    mockEmailInput.dispatchEvent = vi.fn()

    mockPasswordInput = document.createElement('input') as HTMLInputElement
    mockPasswordInput.type = 'password'
    mockPasswordInput.value = ''
    mockPasswordInput.dispatchEvent = vi.fn()

    mockLoginButton = document.createElement('button') as HTMLButtonElement
    mockLoginButton.type = 'submit'
    mockLoginButton.click = vi.fn()

    // document.querySelectorのモック
    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'input[type="email"]') return mockEmailInput
      if (selector === 'input[type="password"]') return mockPasswordInput
      if (selector === 'button[type="submit"]') return mockLoginButton
      return null
    })
  })

  describe('環境による表示制御', () => {
    it('開発環境（isDev: true）の場合、フローティングデバッグボタンが表示される', () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // フローティングボタンが存在することを確認
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      expect(floatingButton.exists()).toBe(true)

      // 初期状態ではパネルは閉じている
      const debugPanel = wrapper.find('[role="group"][aria-label="デバッグログイン"]')
      expect(debugPanel.exists()).toBe(false)
    })

    it('本番環境（isDev: false）の場合、何も表示されない', () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: false,
        },
      })

      // フローティングボタンも存在しない
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      expect(floatingButton.exists()).toBe(false)
    })
  })

  describe('パネルの開閉機能', () => {
    it('フローティングボタンクリック時にパネルが開く', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // パネルが開いてユーザーボタンが表示される
      const user1Button = wrapper.find('button[aria-label="テストユーザー1でログイン"]')
      const user2Button = wrapper.find('button[aria-label="テストユーザー2でログイン"]')

      expect(user1Button.exists()).toBe(true)
      expect(user2Button.exists()).toBe(true)
      expect(user1Button.text()).toContain('Test User 1')
      expect(user2Button.text()).toContain('Test User 2')
    })

    it('クローズボタンクリック時にパネルが閉じる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // クローズボタンをクリック
      const closeButton = wrapper.find('button[aria-label="パネルを閉じる"]')
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()

      // パネルが閉じている
      const debugPanel = wrapper.find('[role="group"][aria-label="デバッグログイン"]')
      expect(debugPanel.exists()).toBe(false)
    })
  })

  describe('フォーム自動入力機能', () => {
    it('ユーザー1ボタンクリック時にフォームに正しい値が設定される', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー1ボタンをクリック
      const user1Button = wrapper.find('button[aria-label="テストユーザー1でログイン"]')
      await user1Button.trigger('click')

      // DOM要素にアクセスできるよう少し待つ
      await new Promise(resolve => setTimeout(resolve, 150))

      // フォーム要素の取得が試行されたことを確認
      expect(document.querySelector).toHaveBeenCalledWith('input[type="email"]')
      expect(document.querySelector).toHaveBeenCalledWith('input[type="password"]')
      expect(document.querySelector).toHaveBeenCalledWith('button[type="submit"]')

      // フォームに正しい値が設定されたことを確認
      expect(mockEmailInput.value).toBe('user1@example.com')
      expect(mockPasswordInput.value).toBe('railuxt01')

      // input イベントが発火されたことを確認
      expect(mockEmailInput.dispatchEvent).toHaveBeenCalled()
      expect(mockPasswordInput.dispatchEvent).toHaveBeenCalled()

      // ログインボタンがクリックされたことを確認
      expect(mockLoginButton.click).toHaveBeenCalled()
    })

    it('ユーザー2ボタンクリック時にフォームに正しい値が設定される', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー2ボタンをクリック
      const user2Button = wrapper.find('button[aria-label="テストユーザー2でログイン"]')
      await user2Button.trigger('click')

      // DOM要素にアクセスできるよう少し待つ
      await new Promise(resolve => setTimeout(resolve, 150))

      // フォーム要素の取得が試行されたことを確認
      expect(document.querySelector).toHaveBeenCalledWith('input[type="email"]')
      expect(document.querySelector).toHaveBeenCalledWith('input[type="password"]')
      expect(document.querySelector).toHaveBeenCalledWith('button[type="submit"]')

      // フォームに正しい値が設定されたことを確認
      expect(mockEmailInput.value).toBe('user2@example.com')
      expect(mockPasswordInput.value).toBe('railuxt02')

      // input イベントが発火されたことを確認
      expect(mockEmailInput.dispatchEvent).toHaveBeenCalled()
      expect(mockPasswordInput.dispatchEvent).toHaveBeenCalled()

      // ログインボタンがクリックされたことを確認
      expect(mockLoginButton.click).toHaveBeenCalled()
    })

    it('フォーム要素が見つからない場合はエラーハンドリングされる', async () => {
      // document.querySelectorがnullを返すようにモック
      vi.mocked(document.querySelector).mockReturnValue(null)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー1ボタンをクリック
      const user1Button = wrapper.find('button[aria-label="テストユーザー1でログイン"]')
      await user1Button.trigger('click')

      // エラーハンドリングの確認
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(consoleSpy).toHaveBeenCalledWith('user1ログインエラー:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('ローディング状態', () => {
    it('ログイン処理中はボタンがローディング状態になる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー1ボタンをクリック
      const user1Button = wrapper.find('button[aria-label="テストユーザー1でログイン"]')
      await user1Button.trigger('click')
      await wrapper.vm.$nextTick()

      // ローディング状態の確認
      expect(user1Button.text()).toContain('ログイン中...')
      expect(user1Button.attributes('disabled')).toBeDefined()
    })
  })

  describe('アクセシビリティ', () => {
    it('フローティングボタンに適切なARIA属性が設定されている', () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      expect(floatingButton.exists()).toBe(true)
      expect(floatingButton.attributes('aria-label')).toBe('デバッグパネルを開閉')
    })

    it('パネル内のボタンに適切なaria-label属性が設定されている', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      const user1Button = wrapper.find('button[aria-label="テストユーザー1でログイン"]')
      const user2Button = wrapper.find('button[aria-label="テストユーザー2でログイン"]')
      const closeButton = wrapper.find('button[aria-label="パネルを閉じる"]')

      expect(user1Button.exists()).toBe(true)
      expect(user2Button.exists()).toBe(true)
      expect(closeButton.exists()).toBe(true)
    })
  })
})
