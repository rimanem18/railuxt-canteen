/**
 * デバッグログイン用テストユーザー設定
 * 開発・検証環境でのログインテストに使用するユーザー情報を管理
 */

/**
 * テストユーザーの型定義
 */
export interface TestUser {
  /** ユーザー識別子 */
  id: string
  /** 表示名 */
  name: string
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** ボタンの色テーマ */
  color: 'indigo' | 'teal' | 'purple' | 'green' | 'blue' | 'red'
}

/**
 * デバッグログイン用テストユーザーリスト
 * seeds.rbと同期した認証情報を使用
 */
export const debugUsers: TestUser[] = [
  {
    id: 'user1',
    name: 'Test User 1',
    email: 'user1@example.com',
    password: 'railuxt01',
    color: 'indigo',
  },
  {
    id: 'user2',
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'railuxt02',
    color: 'teal',
  },
]

/**
 * 色テーマに対応するTailwind CSSクラスのマッピング
 */
export const colorClasses: Record<TestUser['color'], { bg: string, hover: string, focus: string }> = {
  indigo: {
    bg: 'bg-indigo-600',
    hover: 'hover:bg-indigo-500',
    focus: 'focus:ring-indigo-500',
  },
  teal: {
    bg: 'bg-teal-600',
    hover: 'hover:bg-teal-500',
    focus: 'focus:ring-teal-500',
  },
  purple: {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-500',
    focus: 'focus:ring-purple-500',
  },
  green: {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-500',
    focus: 'focus:ring-green-500',
  },
  blue: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-500',
    focus: 'focus:ring-blue-500',
  },
  red: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-500',
    focus: 'focus:ring-red-500',
  },
}
