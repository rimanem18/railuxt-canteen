import type { RouteLocationNormalized } from 'vue-router'

/**
 * ゲストミドルウェア: ログイン状態に基づいてルーティングを制御する
 *
 * @param to - 遷移先のルート情報
 * @param from - 遷移元のルート情報
 * @returns ナビゲーション制御結果、またはundefined
 */
export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // クライアントサイドでのみ実行する
    if (import.meta.server) {
      return
    }

    try {
      const auth = useAuth()

      // useAuth が正常に取得できない場合はスキップ
      if (!auth) {
        console.warn('[Guest Middleware] useAuth が利用できません')
        return
      }

      // 初回アクセス時やページリフレッシュ時は認証状態を確認
      if (!auth.user.value) {
        await auth.fetchUser()
      }

      const isLoggedIn = auth.isLoggedIn
      const currentUser = auth.user

      // デバッグ情報を出力
      console.log('[Guest Middleware] 実行中:', {
        path: to.path,
        isLoggedIn: isLoggedIn.value,
        user: currentUser.value,
        hasAuth: !!auth,
        fromPath: from.path,
      })

      // ログイン済みユーザーが /login にアクセスした場合、/ にリダイレクト
      if (isLoggedIn.value && to.path === '/login') {
        console.log('[Guest Middleware] リダイレクト実行: /login → /')
        return navigateTo('/')
      }
    }
    catch (error) {
      console.error('[Guest Middleware] エラー:', error)
      // エラーが発生した場合はミドルウェアをスキップ
    }
  },
)
