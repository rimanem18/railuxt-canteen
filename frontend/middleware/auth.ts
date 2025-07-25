import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const { isLoggedIn } = useAuth()

    // ログインしていない場合はログインページにリダイレクト
    if (!isLoggedIn.value) {
      return navigateTo('/login')
    }
  },
)
