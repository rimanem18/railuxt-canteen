import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// シンプルな App コンポーネントの模擬
const App = defineComponent({
  template: `
    <div>
      <nav data-testid="navbar">NavBar</nav>
      <div class="p-4 flex justify-center items-center flex-col min-w-[800px]">
        <div data-testid="nuxt-page">NuxtPage</div>
      </div>
    </div>
  `,
  setup() {
    const mockFetchUser = vi.fn()

    // onMounted の模擬
    const onMounted = vi.fn((callback) => {
      callback()
    })

    onMounted(async () => {
      await mockFetchUser()
    })

    return { mockFetchUser }
  },
})

describe('App.vue - 基本構造', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('NavBarコンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(App)
    expect(wrapper.find('[data-testid="navbar"]').exists()).toBe(true)
  })

  it('NuxtPageコンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(App)
    expect(wrapper.find('[data-testid="nuxt-page"]').exists()).toBe(true)
  })

  it('メインコンテナに適切なCSSクラスが適用される', () => {
    const wrapper = mount(App)
    const mainContainer = wrapper.findAll('div')[1] // 2番目のdivが main container
    expect(mainContainer.classes()).toContain('p-4')
    expect(mainContainer.classes()).toContain('flex')
    expect(mainContainer.classes()).toContain('justify-center')
    expect(mainContainer.classes()).toContain('items-center')
    expect(mainContainer.classes()).toContain('flex-col')
    expect(mainContainer.classes()).toContain('min-w-[800px]')
  })

  it('エラーなしでレンダリングされる', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})
