/**
 * 注文ステータスに関する表示ロジックを管理するcomposable
 * ステータスのラベル、CSS クラス、ドットクラスの取得機能を提供
 */

/**
 * ステータス表示設定の型定義
 */
interface StatusConfig {
  label: string
  class: string
  dotClass: string
}

/**
 * ステータス設定のマップ
 * 各ステータスに対応する表示ラベルとCSSクラスを定義
 */
const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: '未提供',
    class: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    dotClass: 'bg-yellow-400',
  },
  confirmed: {
    label: '受付済み',
    class: 'bg-blue-50 text-blue-700 border border-blue-200',
    dotClass: 'bg-blue-400',
  },
  preparing: {
    label: '調理中',
    class: 'bg-orange-50 text-orange-700 border border-orange-200',
    dotClass: 'bg-orange-400',
  },
  ready: {
    label: '提供準備完了',
    class: 'bg-green-50 text-green-700 border border-green-200',
    dotClass: 'bg-green-400',
  },
  completed: {
    label: '提供済み',
    class: 'bg-gray-50 text-gray-600 border border-gray-200',
    dotClass: 'bg-gray-400',
  },
  cancelled: {
    label: 'キャンセル',
    class: 'bg-red-50 text-red-700 border border-red-200',
    dotClass: 'bg-red-400',
  },
}

/**
 * デフォルトのステータス設定
 * 未知のステータスに対するフォールバック値
 */
const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: '不明',
  class: 'bg-gray-50 text-gray-600 border border-gray-200',
  dotClass: 'bg-gray-400',
}

/**
 * 注文ステータスの表示ロジックを提供するcomposable
 * @param status - 注文ステータス文字列
 * @returns ステータスの表示情報（ラベル、クラス、ドットクラス）
 */
export const useOrderStatus = (status: string) => {
  /**
   * ステータス設定を取得する
   * 未知のステータスの場合はデフォルト設定を返す
   */
  const getStatusConfig = (): StatusConfig => {
    return STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG
  }

  const config = getStatusConfig()

  /**
   * ステータスのラベル表示を取得する
   * @returns 表示用ラベル文字列
   */
  const getStatusLabel = (): string => {
    return config.label
  }

  /**
   * ステータスの表示クラスを取得する
   * @returns CSSクラス文字列
   */
  const getStatusClass = (): string => {
    return config.class
  }

  /**
   * ステータスドットの表示クラスを取得する
   * @returns CSSクラス文字列
   */
  const getStatusDotClass = (): string => {
    return config.dotClass
  }

  return {
    getStatusLabel,
    getStatusClass,
    getStatusDotClass,
  }
}
