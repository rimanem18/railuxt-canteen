/**
 * メイン認証コンポーザブル
 *
 * 単一責任：認証状態の管理と統合インターフェースの提供
 * - ユーザー情報の状態管理（useState）
 * - ログイン状態の計算プロパティ
 * - 分離されたモジュールの統合
 * - UIコンポーネント向けのシンプルなAPI提供
 */

import type { User, AuthState, LoginOptions } from '~/types/auth'

/**
 * 認証機能を提供するメインコンポーザブル関数
 * @returns 認証状態とログイン・ログアウト関数
 */
export const useAuth = () => {
  // 分離されたモジュールを統合
  const { hasValidTokens, clearTokens } = useAuthTokens()
  const { login: apiLogin, logout: apiLogout, validateToken } = useAuthApi()

  // ユーザー情報をuseStateで管理（アプリ全体で共有）
  // リロードしても状態が保持される
  const user = useState<User | null>('user', () => null)

  // エラー情報
  const error = ref<string | null>(null)

  // ログイン状態の判定（計算プロパティ）
  const isLoggedIn = computed(() => !!user.value)

  /**
   * 認証状態を取得
   * @returns 現在の認証状態
   */
  const getAuthState = (): AuthState => ({
    user: user.value,
    isLoggedIn: isLoggedIn.value,
    error: error.value,
  })

  /**
   * メールアドレスとパスワードでログイン
   * @param email - メールアドレス
   * @param password - パスワード
   * @param options - ログインオプション
   * @returns ログイン成功時true、失敗時false
   */
  const login = async (
    email: string,
    password: string,
    options: LoginOptions = {},
  ): Promise<boolean> => {
    // エラーを初期化
    error.value = null

    try {
      const result = await apiLogin(email, password, options)

      if (result.success && result.data) {
        // ユーザー情報を状態に保存
        user.value = result.data
        return true
      }
      else {
        // ログイン失敗時の処理
        error.value = result.error?.message || 'ログイン失敗'
        clearAuth()
        return false
      }
    }
    catch (unexpectedError) {
      // 予期しないエラーの処理
      console.error('予期しないログインエラー:', unexpectedError)
      error.value = 'ログイン処理中に予期しないエラーが発生しました'
      clearAuth()
      return false
    }
  }

  /**
   * デバッグ用ログイン（開発・検証用）
   * @param email - メールアドレス
   * @param password - パスワード
   * @returns ログイン成功時true、失敗時false
   */
  const debugLogin = async (email: string, password: string): Promise<boolean> => {
    return login(email, password, { debug: true })
  }

  /**
   * ログアウト処理
   * @returns ログアウト処理の完了を待つPromise
   */
  const logout = async (): Promise<void> => {
    try {
      // API側のログアウト処理（失敗しても続行）
      await apiLogout()
    }
    finally {
      // 成功・失敗に関わらずクライアント側の認証情報をクリア
      clearAuth()
    }
  }

  /**
   * 保存されたトークンを使用してユーザー情報を取得
   * @returns 取得処理の完了を待つPromise
   */
  const fetchUser = async (): Promise<void> => {
    // 必要なトークンが全て揃っていない場合は処理をスキップ
    if (!hasValidTokens()) {
      return
    }

    try {
      const result = await validateToken()

      if (result.success && result.data) {
        // ユーザー情報を状態に保存
        user.value = result.data
      }
      else {
        // トークンが無効な場合は認証情報をクリア
        console.warn('トークン検証失敗:', result.error?.message)
        clearAuth()
      }
    }
    catch (unexpectedError) {
      // 予期しないエラーの処理
      console.error('予期しないトークン検証エラー:', unexpectedError)
      clearAuth()
    }
  }

  /**
   * 認証情報を全てクリア（内部関数）
   */
  const clearAuth = (): void => {
    clearTokens()
    user.value = null
    error.value = null
  }

  /**
   * エラー状態をクリア
   */
  const clearError = (): void => {
    error.value = null
  }

  // 公開インターフェース（必要最小限に絞る）
  return {
    // 読み取り専用状態
    user: readonly(user),
    isLoggedIn,
    error: readonly(error),

    // アクションメソッド
    login,
    debugLogin,
    logout,
    fetchUser,

    // ユーティリティ
    getAuthState,
    clearError,
  }
}
