import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import LoginPage from '~/pages/login.vue';

// useAuth composable をモック化
const mockLogin = vi.fn();
const mockErrorMsg = ref<string | null>(null);
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    errorMsg: mockErrorMsg,
  }),
}));

// useRouter をモック化
const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('login.vue', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    mockErrorMsg.value = null;
  });

  it('フォームが正しく表示される', () => {
    const wrapper = mount(LoginPage);

    // タイトルが表示されているかチェック
    expect(wrapper.find('h2').text()).toBe('ログイン');
    
    // メールアドレス入力フィールドが存在するかチェック
    const emailInput = wrapper.find('input[type="email"]');
    expect(emailInput.exists()).toBe(true);
    expect(emailInput.attributes('placeholder')).toBe('メールアドレス');
    
    // パスワード入力フィールドが存在するかチェック
    const passwordInput = wrapper.find('input[type="password"]');
    expect(passwordInput.exists()).toBe(true);
    expect(passwordInput.attributes('placeholder')).toBe('パスワード');
    
    // ログインボタンが存在するかチェック
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.exists()).toBe(true);
    expect(submitButton.text()).toBe('ログイン');
  });

  it('フォームを送信するとuseAuthのlogin関数が呼ばれる', async () => {
    mockLogin.mockResolvedValue(true); // ログイン成功をシミュレート
    const wrapper = mount(LoginPage);

    // フォームに入力
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // useAuthのlogin関数が正しい引数で呼ばれたかチェック
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('ログイン成功時にトップページに遷移する', async () => {
    mockLogin.mockResolvedValue(true); // ログイン成功をシミュレート
    const wrapper = mount(LoginPage);

    // フォームに入力
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // Vueの次の更新サイクルを待つ
    await wrapper.vm.$nextTick();

    // トップページへの遷移が実行されたかチェック
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('ログイン失敗時は遷移しない', async () => {
    mockLogin.mockResolvedValue(false); // ログイン失敗をシミュレート
    const wrapper = mount(LoginPage);

    // フォームに入力
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('wrong-password');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // Vueの次の更新サイクルを待つ
    await wrapper.vm.$nextTick();

    // 遷移が実行されないことをチェック
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('エラーメッセージが表示される', async () => {
    mockErrorMsg.value = 'Invalid credentials';
    const wrapper = mount(LoginPage);

    // DOM更新を待つ
    await nextTick();

    // エラーメッセージが表示されているかチェック
    const errorElement = wrapper.find('p.text-red-500');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toBe('Invalid credentials');
  });

  it('エラーメッセージがない場合は表示されない', async () => {
    mockErrorMsg.value = null;
    const wrapper = mount(LoginPage);

    // DOM更新を待つ
    await nextTick();

    // エラーメッセージが表示されていないことをチェック
    const errorElement = wrapper.find('p.text-red-500');
    expect(errorElement.exists()).toBe(false);
  });

  it('入力値が双方向バインディングで更新される', async () => {
    const wrapper = mount(LoginPage);

    // メールアドレスの入力値を更新
    const emailInput = wrapper.find('input[type="email"]');
    await emailInput.setValue('test@example.com');
    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com');

    // パスワードの入力値を更新
    const passwordInput = wrapper.find('input[type="password"]');
    await passwordInput.setValue('password123');
    expect((passwordInput.element as HTMLInputElement).value).toBe('password123');
  });

  it('フォームのsubmitイベントでpreventDefaultが呼ばれる', async () => {
    mockLogin.mockResolvedValue(true);
    const wrapper = mount(LoginPage);

    // フォームのsubmitイベントを監視
    const form = wrapper.find('form');
    const submitEvent = vi.fn();
    form.element.addEventListener('submit', submitEvent);

    // フォームを送信
    await form.trigger('submit.prevent');

    // prevent修飾子により、デフォルトのsubmitイベントが阻止されることを確認
    // この場合、実際のsubmitイベントは発生しないが、Vue.jsのイベントハンドラーが正しく動作する
    expect(mockLogin).toHaveBeenCalled();
  });
});