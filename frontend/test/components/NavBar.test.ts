import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '~/components/NavBar.vue';

describe('NavBar.vue', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  it('ナビゲーションバーの基本構造が表示される', () => {
    const wrapper = mount(NavBar, {
      props: {
        user: null,
        isLoggedIn: false
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });

    // ナビゲーションバーの基本要素が存在するかチェック
    expect(wrapper.find('[data-testid="navbar"]').exists()).toBe(true);
    expect(wrapper.find('nav').classes()).toContain('p-4');
    expect(wrapper.find('nav').classes()).toContain('bg-gray-100');
    
    // Homeリンクが常に表示されているかチェック
    const homeLink = wrapper.find('[data-testid="home-link"]');
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.text()).toBe('Home');
  });

  it('未認証の場合、ログインリンクを表示する', () => {
    const wrapper = mount(NavBar, {
      props: {
        user: null,
        isLoggedIn: false
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });
    
    // ログインリンクが表示されているかチェック
    const loginLink = wrapper.find('[data-testid="login-link"]');
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.text()).toBe('ログイン');
    expect(loginLink.classes()).toContain('bg-blue-500');
    
    // ログアウトボタンが表示されていないことをチェック
    const logoutButton = wrapper.find('[data-testid="logout-button"]');
    expect(logoutButton.exists()).toBe(false);
    
    // Ordersリンクが表示されていないことをチェック
    const ordersLink = wrapper.find('[data-testid="orders-link"]');
    expect(ordersLink.exists()).toBe(false);
    
    // ユーザー名が表示されていないことをチェック
    const userGreeting = wrapper.find('[data-testid="user-greeting"]');
    expect(userGreeting.exists()).toBe(false);
  });

  it('認証済みの場合、ユーザー名とログアウトボタンを表示する', () => {
    const mockUserData = { id: 1, name: 'テストユーザー', email: 'test@example.com' };
    
    const wrapper = mount(NavBar, {
      props: {
        user: mockUserData,
        isLoggedIn: true
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });

    // ユーザー名の挨拶が表示されているかチェック
    const userGreeting = wrapper.find('[data-testid="user-greeting"]');
    expect(userGreeting.exists()).toBe(true);
    expect(userGreeting.text()).toBe('ようこそ、テストユーザーさん');
    
    // ログアウトボタンが表示されているかチェック
    const logoutButton = wrapper.find('[data-testid="logout-button"]');
    expect(logoutButton.exists()).toBe(true);
    expect(logoutButton.text()).toBe('ログアウト');
    expect(logoutButton.classes()).toContain('bg-red-500');
    
    // Ordersリンクが表示されているかチェック
    const ordersLink = wrapper.find('[data-testid="orders-link"]');
    expect(ordersLink.exists()).toBe(true);
    expect(ordersLink.text()).toBe('Orders');
    
    // ログインリンクが表示されていないことをチェック
    const loginLink = wrapper.find('[data-testid="login-link"]');
    expect(loginLink.exists()).toBe(false);
  });

  it('ログアウトボタンをクリックするとlogoutイベントが発火される', async () => {
    const mockUserData = { id: 1, name: 'テストユーザー', email: 'test@example.com' };
    
    const wrapper = mount(NavBar, {
      props: {
        user: mockUserData,
        isLoggedIn: true
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });

    // ログアウトボタンをクリック
    const logoutButton = wrapper.find('[data-testid="logout-button"]');
    await logoutButton.trigger('click');

    // logoutイベントが発火されたかチェック
    expect(wrapper.emitted('logout')).toBeTruthy();
    expect(wrapper.emitted('logout')).toHaveLength(1);
  });

  it('ユーザー名がnullの場合でも正しく表示される', () => {
    const mockUserData = { id: 1, name: null, email: 'test@example.com' };
    
    const wrapper = mount(NavBar, {
      props: {
        user: mockUserData,
        isLoggedIn: true
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });

    // ユーザー名の部分が空文字列として表示されるかチェック
    const userGreeting = wrapper.find('[data-testid="user-greeting"]');
    expect(userGreeting.exists()).toBe(true);
    expect(userGreeting.text()).toBe('ようこそ、さん');
  });

  it('ログイン状態の変化に応じて表示が切り替わる', async () => {
    // 最初は未認証状態でマウント
    const wrapper = mount(NavBar, {
      props: {
        user: null,
        isLoggedIn: false
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" v-bind="$attrs"><slot /></a>',
            props: ['to']
          }
        },
      },
    });

    // 未認証状態の表示をチェック
    expect(wrapper.find('[data-testid="login-link"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="logout-button"]').exists()).toBe(false);

    // 認証済み状態に変更
    await wrapper.setProps({
      user: { id: 1, name: 'テストユーザー', email: 'test@example.com' },
      isLoggedIn: true
    });

    // 認証済み状態の表示に変わっているかチェック
    expect(wrapper.find('[data-testid="login-link"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="logout-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-greeting"]').exists()).toBe(true);
  });
});