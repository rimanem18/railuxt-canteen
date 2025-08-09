/**
 * デバッグログイン用DOM操作を提供するコンポーザブル関数
 * フォーム要素への自動入力とログインボタンクリックを担当
 * 単一責任の原則に基づき、DOM操作のみに特化
 */

/**
 * フォーム自動入力の結果
 */
export interface FormFillResult {
  /** 処理成功フラグ */
  success: boolean
  /** エラーメッセージ（失敗時） */
  errorMessage?: string
}

/**
 * デバッグログイン機能を提供するコンポーザブル関数
 * @returns {object} フォーム自動入力関数
 */
export const useDebugLogin = () => {
  /**
   * ログインフォームに認証情報を自動入力してログインボタンをクリック
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<FormFillResult>} 処理結果
   */
  async function fillLoginForm(email: string, password: string): Promise<FormFillResult> {
    try {
      // フォーム要素を取得
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
      const loginButton = document.querySelector('button[type="submit"]') as HTMLButtonElement

      // 必要な要素の存在チェック
      if (!emailInput || !passwordInput || !loginButton) {
        return {
          success: false,
          errorMessage: 'ログインフォームの要素が見つかりません',
        }
      }

      // フォームに値を設定
      emailInput.value = email
      passwordInput.value = password

      // Vue の reactivity を更新するためにイベントを発火
      // これによりv-modelが正しく更新される
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

      // 少し待ってからログインボタンをクリック
      // DOM更新の完了を待つため
      await new Promise(resolve => setTimeout(resolve, 100))

      loginButton.click()

      return {
        success: true,
      }
    }
    catch (error) {
      console.error('フォーム自動入力エラー:', error)
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : '不明なエラーが発生しました',
      }
    }
  }

  return {
    fillLoginForm,
  }
}
