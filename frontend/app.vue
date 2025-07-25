<template>
  <NavBar
    :user="user"
    :is-logged-in="isLoggedIn"
    @logout="handleLogout"
  />
  <div class="p-4 flex justify-center items-center flex-col min-w-[800px]">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
/**
 * メインアプリケーションコンポーネント（Container component）
 * 認証状態を管理し、子コンポーネントに props として渡す
 */
const { user, isLoggedIn, logout, fetchUser } = useAuth()

/**
 * ログアウト処理を実行し、トップページに遷移する
 */
const handleLogout = async () => {
  // ログアウト処理を実行
  await logout()
  // トップページに遷移
  await navigateTo('/')
}

// アプリケーションの初期化時に認証状態を復元
onMounted(async () => {
  await fetchUser()
})
</script>
