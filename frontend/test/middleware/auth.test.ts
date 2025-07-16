import { describe, it, expect, vi, beforeEach } from 'vitest';
import authMiddleware from '~/middleware/auth';

// useAuthとnavigateToをモック化
const mockIsLoggedIn = { value: false };

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    isLoggedIn: mockIsLoggedIn,
  }),
}));

// グローバルなdefineNuxtRouteMiddleware関数を設定
global.defineNuxtRouteMiddleware = vi.fn((fn: Function) => fn);
global.useAuth = () => ({ isLoggedIn: mockIsLoggedIn });
global.navigateTo = vi.fn();

describe('auth middleware', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    mockIsLoggedIn.value = false;
  });

  it('ユーザーが認証済みの場合、何もしない', () => {
    mockIsLoggedIn.value = true; // 認証済みユーザーを設定
    
    const result = authMiddleware(null as any, null as any);

    // navigateToが呼ばれないことをチェック
    expect(global.navigateTo).not.toHaveBeenCalled();
    // 関数が何も返さないことをチェック
    expect(result).toBeUndefined();
  });

  it('ユーザーが未認証の場合、/loginにリダイレクトする', () => {
    mockIsLoggedIn.value = false; // 未認証状態を設定
    
    const result = authMiddleware(null as any, null as any);

    // navigateToが正しい引数で呼ばれたかチェック
    expect(global.navigateTo).toHaveBeenCalledWith('/login');
  });

  it('ログイン状態がfalseの場合、/loginにリダイレクトする', () => {
    mockIsLoggedIn.value = false;
    
    authMiddleware(null as any, null as any);

    expect(global.navigateTo).toHaveBeenCalledWith('/login');
  });

  it('ログイン状態がtrueの場合、リダイレクトしない', () => {
    mockIsLoggedIn.value = true;
    
    authMiddleware(null as any, null as any);

    expect(global.navigateTo).not.toHaveBeenCalled();
  });

  it('toとfromパラメータを受け取る', () => {
    const mockTo = { path: '/protected' };
    const mockFrom = { path: '/public' };
    
    mockIsLoggedIn.value = false;
    
    authMiddleware(mockTo as any, mockFrom as any);

    // パラメータに関係なくログイン状態のみをチェックする
    expect(global.navigateTo).toHaveBeenCalledWith('/login');
  });
});