<template>
  <nav
    class="p-4 bg-gray-100 flex justify-between items-center"
    data-testid="navbar"
  >
    <div class="flex items-center space-x-4">
      <NuxtLink
        to="/"
        class="hover:text-blue-600"
        data-testid="home-link"
      >Home</NuxtLink>
      <NuxtLink
        v-if="isLoggedIn"
        to="/orders"
        class="hover:text-blue-600"
        data-testid="orders-link"
      >
        Orders
      </NuxtLink>
    </div>

    <div class="flex items-center space-x-4">
      <div
        v-if="isLoggedIn"
        class="flex items-center space-x-4"
      >
        <span
          class="text-gray-700"
          data-testid="user-greeting"
        >
          ようこそ、{{ user?.name }}さん
        </span>
        <button
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          data-testid="logout-button"
          @click="handleLogout"
        >
          ログアウト
        </button>
      </div>
      <div v-else>
        <NuxtLink
          to="/login"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          data-testid="login-link"
        >
          ログイン
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * ナビゲーションバーのPresentational component
 * 認証状態をpropsとして受け取り、イベントを親コンポーネントに通知する
 */

import type { User } from '~/types/schemas'

interface Props {
  /** 現在のユーザー情報 */
  user: User | null
  /** ログイン状態 */
  isLoggedIn: boolean
}

interface Emits {
  /** ログアウトボタンがクリックされたときに発火 */
  (e: 'logout'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * ログアウトボタンクリック時の処理
 * 親コンポーネントにlogoutイベントを発火する
 */
const handleLogout = () => {
  // 親コンポーネントに実際のログアウト処理を委譲
  emit('logout')
}
</script>
