<template>
  <form
    class="max-w-xs mx-auto mt-16 p-4 border rounded-lg"
    @submit.prevent="onLogin"
  >
    <h2 class="text-xl mb-4">
      ログイン
    </h2>
    <input
      v-model="email"
      placeholder="メールアドレス"
      type="email"
      class="mb-2 p-2 border w-full"
    >
    <input
      v-model="password"
      placeholder="パスワード"
      type="password"
      class="mb-2 p-2 border w-full"
    >
    <button
      type="submit"
      class="px-4 py-2 bg-blue-600 text-white rounded w-full"
    >
      ログイン
    </button>
    <p
      v-if="errorMsg"
      class="text-red-500 mt-2"
    >
      {{ errorMsg }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const { login, errorMsg } = useAuth()
const router = useRouter()

/**
 * ログイン処理を実行し、成功時にトップページへ遷移
 */
async function onLogin() {
  const ok = await login(email.value, password.value)
  // ログイン成功時のみトップページへ遷移（エラー時はerrorMsgで表示）
  if (ok) router.push('/')
}
</script>
