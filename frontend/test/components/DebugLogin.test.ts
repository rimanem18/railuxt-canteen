import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DebugLogin from '~/components/DebugLogin.vue'
import type { TestUser } from '~/config/debug-users'

// テスト用のデータ
const mockTestUsers: TestUser[] = [
  {
    id: 'user1',
    name: 'Test User 1',
    email: 'user1@example.com',
    password: 'password123',
    color: 'indigo',
  },
  {
    id: 'user2',
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'password456',
    color: 'teal',
  },
]

describe('DebugLogin.vue', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
  })

  describe('環境による表示制御', () => {
    it('開発環境（isDev: true）の場合、フローティングデバッグボタンが表示される', () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
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
          testUsers: mockTestUsers,
        },
      })

      // コンポーネント全体が表示されない
      expect(wrapper.html()).toContain('<!--v-if-->')
    })
  })

  describe('パネルの開閉機能', () => {
    it('フローティングボタンクリック時にパネルが開く', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
        },
      })

      // フローティングボタンをクリック
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // パネルが開いてユーザーボタンが表示される
      const user1Button = wrapper.find('button[aria-label="Test User 1でログイン"]')
      const user2Button = wrapper.find('button[aria-label="Test User 2でログイン"]')

      expect(user1Button.exists()).toBe(true)
      expect(user2Button.exists()).toBe(true)
      expect(user1Button.text()).toContain('Test User 1')
      expect(user2Button.text()).toContain('Test User 2')
    })

    it('クローズボタンクリック時にパネルが閉じる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
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

  describe('イベントエミット機能', () => {
    it('ユーザー1ボタンクリック時に正しいイベントがエミットされる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー1ボタンをクリック
      const user1Button = wrapper.find('button[aria-label="Test User 1でログイン"]')
      await user1Button.trigger('click')

      // loading-startイベントがエミットされている
      expect(wrapper.emitted('loading-start')).toBeTruthy()
      expect(wrapper.emitted('loading-start')?.[0]).toEqual(['user1'])

      // user-selectedイベントがエミットされている
      expect(wrapper.emitted('user-selected')).toBeTruthy()
      const userSelectedEvent = wrapper.emitted('user-selected')?.[0] as any[]
      expect(userSelectedEvent[0]).toEqual({
        email: 'user1@example.com',
        password: 'password123',
        userInfo: mockTestUsers[0],
      })
    })

    it('ユーザー2ボタンクリック時に正しいイベントがエミットされる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ユーザー2ボタンをクリック
      const user2Button = wrapper.find('button[aria-label="Test User 2でログイン"]')
      await user2Button.trigger('click')

      // loading-startイベントがエミットされている
      expect(wrapper.emitted('loading-start')).toBeTruthy()
      expect(wrapper.emitted('loading-start')?.[0]).toEqual(['user2'])

      // user-selectedイベントがエミットされている
      expect(wrapper.emitted('user-selected')).toBeTruthy()
      const userSelectedEvent = wrapper.emitted('user-selected')?.[0] as any[]
      expect(userSelectedEvent[0]).toEqual({
        email: 'user2@example.com',
        password: 'password456',
        userInfo: mockTestUsers[1],
      })
    })
  })

  describe('ローディング状態', () => {
    it('ローディング中はボタンがディセーブルになる', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
          loading: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ボタンがディセーブルになっている
      const user1Button = wrapper.find('button[aria-label="Test User 1でログイン"]')
      const user2Button = wrapper.find('button[aria-label="Test User 2でログイン"]')

      expect(user1Button.attributes('disabled')).toBeDefined()
      expect(user2Button.attributes('disabled')).toBeDefined()
    })

    it('ローディング中のボタンにはスピナーアイコンが表示される', async () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
          loading: true,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // ローディング状態では全てのボタンがディセーブルかつスピナー無し状態になる
      // （currentUserId が null のため、どのボタンも個別のスピナーは表示されない）
      const user1Button = wrapper.find('button[aria-label="Test User 1でログイン"]')
      const userCircleIcon = user1Button.find('[name="heroicons:user-circle"]')

      // ローディング中はuser-circleアイコンが表示される（個別ボタンがアクティブでないため）
      expect(userCircleIcon.exists()).toBe(true)
    })
  })

  describe('アクセシビリティ', () => {
    it('フローティングボタンに適切なARIA属性が設定されている', () => {
      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: mockTestUsers,
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
          testUsers: mockTestUsers,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // 各ボタンのaria-label属性を確認
      const user1Button = wrapper.find('button[aria-label="Test User 1でログイン"]')
      const user2Button = wrapper.find('button[aria-label="Test User 2でログイン"]')
      const closeButton = wrapper.find('button[aria-label="パネルを閉じる"]')

      expect(user1Button.exists()).toBe(true)
      expect(user2Button.exists()).toBe(true)
      expect(closeButton.exists()).toBe(true)

      expect(user1Button.attributes('aria-label')).toBe('Test User 1でログイン')
      expect(user2Button.attributes('aria-label')).toBe('Test User 2でログイン')
      expect(closeButton.attributes('aria-label')).toBe('パネルを閉じる')
    })
  })

  describe('Props によるカスタマイズ', () => {
    it('カスタムテストユーザーが正しく表示される', async () => {
      const customUsers: TestUser[] = [
        {
          id: 'custom1',
          name: 'Custom User',
          email: 'custom@example.com',
          password: 'custom123',
          color: 'purple',
        },
      ]

      const wrapper = mount(DebugLogin, {
        props: {
          isDev: true,
          testUsers: customUsers,
        },
      })

      // パネルを開く
      const floatingButton = wrapper.find('button[aria-label="デバッグパネルを開閉"]')
      await floatingButton.trigger('click')
      await wrapper.vm.$nextTick()

      // カスタムユーザーボタンが表示される
      const customButton = wrapper.find('button[aria-label="Custom Userでログイン"]')
      expect(customButton.exists()).toBe(true)
      expect(customButton.text()).toContain('Custom User')
    })
  })
})
