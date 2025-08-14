<template>
  <div class="max-w-xs mx-auto mt-16 relative">
    <Transition
      name="fade"
      mode="out-in"
      appear
    >
      <form
        v-if="!isRedirecting"
        data-testid="login-form"
        class="p-4 border rounded-lg transition-all duration-300 ease-in-out"
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
          class="px-4 py-2 bg-blue-600 text-white rounded w-full relative"
          :disabled="isRedirecting"
        >
          <span v-if="!isRedirecting">ログイン</span>
          <span
            v-else
            class="absolute inset-0 flex items-center justify-center"
          >
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        </button>
        <p
          v-if="errorMsg"
          data-testid="error-message"
          class="text-red-500 mt-2"
        >
          {{ errorMsg }}
        </p>
      </form>
    </Transition>

    <!-- DebugLoginコンポーネント（フローティングデザインのため独立表示） -->
    <DebugLogin
      ref="debugLoginRef"
      :is-dev="isDev"
      :loading="debugLoginLoading"
      data-testid="debug-login"
      @user-selected="handleDebugLogin"
      @loading-start="handleLoadingStart"
      @loading-end="handleLoadingEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useDebugLogin } from '~/composables/useDebugLogin'
import DebugLogin from '~/components/DebugLogin.vue'
import type { TestUser } from '~/config/debug-users'

definePageMeta({
  middleware: ['guest'],
})

const email = ref('')
const password = ref('')
const debugLoginLoading = ref(false)
const debugLoginRef = ref<InstanceType<typeof DebugLogin> | null>(null)
const isRedirecting = ref(false)

const { login, error: errorMsg } = useAuth()
const { fillLoginForm } = useDebugLogin()
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
  if (ok) {
    isRedirecting.value = true
    await router.push('/')
  }
}

/**
 * DebugLoginコンポーネントからのユーザー選択イベントハンドラ
 * フォームに自動入力してログイン処理を実行
 */
async function handleDebugLogin(credentials: { email: string, password: string, userInfo: TestUser }) {
  try {
    // フォームに認証情報を自動入力
    const result = await fillLoginForm(credentials.email, credentials.password)

    if (!result.success) {
      // フォーム入力に失敗した場合は直接ログイン処理を実行
      console.warn('フォーム自動入力に失敗、直接ログインを試行:', result.errorMessage)
      email.value = credentials.email
      password.value = credentials.password
      await onLogin()
    }
    // フォーム入力に成功した場合は、フォームのsubmitイベントが自動実行される
  }
  catch (error) {
    console.error('デバッグログイン処理エラー:', error)
    debugLoginRef.value?.setLoginMessage(false)
  }
  finally {
    debugLoginLoading.value = false
  }
}

/**
 * デバッグログインのローディング開始ハンドラ
 */
function handleLoadingStart(userId: string) {
  debugLoginLoading.value = true
}

/**
 * デバッグログインのローディング終了ハンドラ
 */
function handleLoadingEnd() {
  debugLoginLoading.value = false
}
</script>
