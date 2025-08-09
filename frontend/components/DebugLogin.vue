/**
 * デバッグ用ワンクリックログインコンポーネント
 * 開発環境でのみ表示され、Apple HIG準拠の洗練されたUIでテストユーザーでの簡単ログインを提供
 * フローティングデザインでメインコンテンツを邪魔せず、必要時のみ展開表示
 * @component DebugLogin
 */
<template>
  <!-- フローティングデバッグパネル - 画面右下に固定配置 -->
  <div
    v-if="isDev"
    class="fixed bottom-4 right-4 z-50"
  >
    <!-- パネル展開時のアニメーション付きコンテナ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <section
        v-if="isOpen"
        role="group"
        aria-label="デバッグログイン"
        class="mb-2 w-64 rounded-lg bg-gray-800 text-white shadow-2xl ring-1 ring-black/5 backdrop-blur-sm"
      >
        <!-- パネルヘッダー - タイトルとクローズボタン -->
        <header class="flex items-center justify-between border-b border-gray-700 p-3">
          <h3 class="text-base font-semibold text-gray-100">
            デバッグログイン
          </h3>
          <button
            aria-label="パネルを閉じる"
            class="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            @click="closePanel"
          >
            <Icon
              name="heroicons:x-mark"
              class="h-4 w-4"
            />
          </button>
        </header>

        <!-- パネル本体 - ログインボタンとフィードバック -->
        <div class="p-4">
          <!-- テストユーザーボタングリッド -->
          <div class="space-y-3">
            <!-- テストユーザー1ログインボタン -->
            <button
              :disabled="isLoading"
              aria-label="テストユーザー1でログイン"
              class="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleUser1Login"
            >
              <Icon
                v-if="!isLoading || currentUser !== 'user1'"
                name="heroicons:user-circle"
                class="h-4 w-4"
              />
              <Icon
                v-else
                name="heroicons:arrow-path"
                class="h-4 w-4 animate-spin"
              />
              <span>{{ isLoading && currentUser === 'user1' ? 'ログイン中...' : 'Test User 1' }}</span>
            </button>

            <!-- テストユーザー2ログインボタン -->
            <button
              :disabled="isLoading"
              aria-label="テストユーザー2でログイン"
              class="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleUser2Login"
            >
              <Icon
                v-if="!isLoading || currentUser !== 'user2'"
                name="heroicons:user-circle"
                class="h-4 w-4"
              />
              <Icon
                v-else
                name="heroicons:arrow-path"
                class="h-4 w-4 animate-spin"
              />
              <span>{{ isLoading && currentUser === 'user2' ? 'ログイン中...' : 'Test User 2' }}</span>
            </button>
          </div>

          <!-- ログイン結果のフィードバック表示 - アイコン付き -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 translate-y-2"
          >
            <div
              v-if="loginMessage"
              class="mt-4 flex items-center gap-2 rounded-md p-2 text-sm font-medium"
              :class="feedbackStyle"
              role="status"
              :aria-live="isSuccess ? 'polite' : 'assertive'"
            >
              <Icon
                :name="isSuccess ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'"
                class="h-4 w-4 flex-shrink-0"
              />
              <span>{{ loginMessage }}</span>
            </div>
          </Transition>
        </div>
      </section>
    </Transition>

    <!-- フローティングアクションボタン - デバッグパネル開閉用 -->
    <button
      aria-label="デバッグパネルを開閉"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
      @click="togglePanel"
    >
      <Icon
        :name="isOpen ? 'heroicons:x-mark' : 'heroicons:bug-ant'"
        class="h-6 w-6 transition-transform duration-200"
        :class="{ 'rotate-90': isOpen }"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * プロップスの型定義
 */
interface Props {
  /** 開発環境フラグ。trueの場合のみコンポーネントを表示 */
  isDev: boolean
}

const props = defineProps<Props>()

// コンポーネントの状態管理
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const currentUser = ref<'user1' | 'user2' | null>(null)
const loginMessage = ref<string>('')
const isSuccess = ref<boolean>(false)

// フィードバックメッセージのスタイルを動的に設定
const feedbackStyle = computed(() => {
  if (isSuccess.value) {
    return 'bg-green-900/50 text-green-300 border border-green-700/50'
  }
  else {
    return 'bg-red-900/50 text-red-300 border border-red-700/50'
  }
})

/**
 * デバッグパネルの開閉状態をトグル
 */
function togglePanel(): void {
  isOpen.value = !isOpen.value
}

/**
 * デバッグパネルを閉じる
 */
function closePanel(): void {
  isOpen.value = false
}

/**
 * ログインフィードバックメッセージを設定
 * @param {boolean} success - ログイン成功フラグ
 * @param {string} userType - ログインしたユーザータイプ
 */
function setLoginMessage(success: boolean, userType: string): void {
  isSuccess.value = success
  if (success) {
    loginMessage.value = `${userType}でログインしました`
  }
  else {
    loginMessage.value = 'ログインに失敗しました'
  }

  // 4秒後にメッセージを自動クリア
  setTimeout(() => {
    loginMessage.value = ''
  }, 4000)
}

/**
 * ログイン画面のフォームに自動入力してログインボタンを押す処理
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @param {'user1' | 'user2'} userType - ユーザータイプ
 */
async function fillFormAndSubmit(email: string, password: string, userType: 'user1' | 'user2'): Promise<void> {
  // ローディング状態を開始
  isLoading.value = true
  currentUser.value = userType

  try {
    // フォーム要素を取得
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
    const loginButton = document.querySelector('button[type="submit"]') as HTMLButtonElement

    if (!emailInput || !passwordInput || !loginButton) {
      throw new Error('ログインフォームの要素が見つかりません')
    }

    // フォームに値を設定
    emailInput.value = email
    passwordInput.value = password

    // Vue の reactivity を更新するためにイベントを発火
    emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }))

    // 少し待ってからログインボタンをクリック
    setTimeout(() => {
      loginButton.click()
      // ログイン処理完了後のフィードバック表示
      setLoginMessage(true, userType === 'user1' ? 'ユーザー1' : 'ユーザー2')

      // 成功時はパネルを自動で閉じる
      setTimeout(() => {
        closePanel()
      }, 1500)

      // ローディング状態を終了
      isLoading.value = false
      currentUser.value = null
    }, 100)
  }
  catch (error) {
    console.error(`${userType}ログインエラー:`, error)
    setLoginMessage(false, '')
    // ローディング状態を終了
    isLoading.value = false
    currentUser.value = null
  }
}

/**
 * テストユーザー1でログイン実行
 * メール: user1@example.com, パスワード: railuxt01（seeds.rbと同sync）
 */
async function handleUser1Login(): Promise<void> {
  await fillFormAndSubmit('user1@example.com', 'railuxt01', 'user1')
}

/**
 * テストユーザー2でログイン実行
 * メール: user2@example.com, パスワード: railuxt02（seeds.rbと同期）
 */
async function handleUser2Login(): Promise<void> {
  await fillFormAndSubmit('user2@example.com', 'railuxt02', 'user2')
}
</script>
