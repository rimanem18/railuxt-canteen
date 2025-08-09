/**
 * デバッグ用ワンクリックログインコンポーネント（SOLID原則準拠版）
 * 開発環境でのみ表示され、Apple HIG準拠の洗練されたUIでテストユーザーでの簡単ログインを提供
 * フローティングデザインでメインコンテンツを邪魔せず、必要時のみ展開表示
 *
 * SOLID原則の適用:
 * - 単一責任: UI表示とユーザー操作イベントの処理のみ
 * - 開放閉鎖: testUsersプロパティで拡張可能
 * - 依存性逆転: DOM操作は親コンポーネントに委譲
 *
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
            <!-- 各テストユーザーのログインボタンを動的生成 -->
            <button
              v-for="testUser in testUsers"
              :key="testUser.id"
              :disabled="isLoading"
              :aria-label="`${testUser.name}でログイン`"
              class="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              :class="getButtonClasses(testUser.color)"
              @click="handleUserLogin(testUser)"
            >
              <Icon
                v-if="!isLoading || currentUserId !== testUser.id"
                name="heroicons:user-circle"
                class="h-4 w-4"
              />
              <Icon
                v-else
                name="heroicons:arrow-path"
                class="h-4 w-4 animate-spin"
              />
              <span>{{ isLoading && currentUserId === testUser.id ? 'ログイン中...' : testUser.name }}</span>
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
import type { TestUser } from '~/config/debug-users'
import { debugUsers, colorClasses } from '~/config/debug-users'

/**
 * プロップスの型定義
 */
interface Props {
  /** 開発環境フラグ。trueの場合のみコンポーネントを表示 */
  isDev: boolean
  /** テストユーザーリスト（デフォルト値として設定ファイルから取得） */
  testUsers?: TestUser[]
  /** 外部からのローディング状態制御 */
  loading?: boolean
}

/**
 * イベントの型定義
 */
interface Emits {
  /** ユーザー選択時に親コンポーネントに通知 */
  (e: 'user-selected', credentials: { email: string, password: string, userInfo: TestUser }): void
  /** ローディング開始を親に通知 */
  (e: 'loading-start', userId: string): void
  /** ローディング終了を親に通知 */
  (e: 'loading-end'): void
}

const props = withDefaults(defineProps<Props>(), {
  testUsers: () => debugUsers,
  loading: false,
})

const emit = defineEmits<Emits>()

// コンポーネントの状態管理（UI表示のみに責任を限定）
const isOpen = ref<boolean>(false)
const currentUserId = ref<string | null>(null)
const loginMessage = ref<string>('')
const isSuccess = ref<boolean>(false)

// 外部制御可能なローディング状態
const isLoading = computed(() => props.loading)

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
 * ボタンの色テーマに応じたTailwind CSSクラスを取得
 * @param {TestUser['color']} color - 色テーマ
 * @returns {string} 適用するクラス文字列
 */
function getButtonClasses(color: TestUser['color']): string {
  const colorClass = colorClasses[color]
  return `${colorClass.bg} ${colorClass.hover} ${colorClass.focus}`
}

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
 * @param {string} userName - ログインしたユーザー名
 */
function setLoginMessage(success: boolean, userName?: string): void {
  isSuccess.value = success
  if (success && userName) {
    loginMessage.value = `${userName}でログインしました`
    // 成功時はパネルを自動で閉じる
    setTimeout(() => {
      closePanel()
    }, 1500)
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
 * テストユーザーでのログイン処理を実行
 * DOM操作は行わず、親コンポーネントにイベントを通知するのみ
 * @param {TestUser} testUser - 選択されたテストユーザー
 */
function handleUserLogin(testUser: TestUser): void {
  // ローディング開始を親に通知
  currentUserId.value = testUser.id
  emit('loading-start', testUser.id)

  // 親コンポーネントにユーザー選択を通知
  // 実際のログイン処理は親コンポーネントが担当
  emit('user-selected', {
    email: testUser.email,
    password: testUser.password,
    userInfo: testUser,
  })

  // フィードバック表示（成功前提、実際の結果は親から制御される）
  setLoginMessage(true, testUser.name)
}

// 外部からのメッセージ制御のための関数を公開
defineExpose({
  setLoginMessage,
  closePanel,
})
</script>
