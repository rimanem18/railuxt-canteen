<template>
  <div class="max-w-xs mx-auto mt-16">
    <form
      data-testid="login-form"
      class="p-4 border rounded-lg"
      @submit.prevent="onLogin"
    >
      <h2 class="text-xl mb-4">
        ログイン
      </h2>
      <input
        v-model="email"
        data-testid="email-input"
        placeholder="メールアドレス"
        type="email"
        class="mb-2 p-2 border w-full"
      >
      <input
        v-model="password"
        data-testid="password-input"
        placeholder="パスワード"
        type="password"
        class="mb-2 p-2 border w-full"
      >
      <button
        type="submit"
        data-testid="login-button"
        class="px-4 py-2 bg-blue-600 text-white rounded w-full"
      >
        ログイン
      </button>
      <p
        v-if="errorMsg"
        data-testid="error-message"
        class="text-red-500 mt-2"
      >
        {{ errorMsg }}
      </p>
    </form>

    <!-- DebugLoginコンポーネント（フローティングデザインのため独立表示） -->
    <DebugLogin
      :is-dev="isDev"
      data-testid="debug-login"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import DebugLogin from '~/components/DebugLogin.vue'

const email = ref('')
const password = ref('')
const { login, errorMsg } = useAuth()
const router = useRouter()

// 開発環境フラグを取得
const { $config } = useNuxtApp()
console.log('isDev:', $config.public.isDev)
const isDev = $config.public.isDev as boolean

/**
 * ログイン処理を実行し、成功時にトップページへ遷移
 */
async function onLogin() {
  const ok = await login(email.value, password.value)
  // ログイン成功時のみトップページへ遷移（エラー時はerrorMsgで表示）
  if (ok) router.push('/')
}
</script>
