/**
 * 日時フォーマット機能を提供するコンポーザブル
 * 注文時刻を日本語で表示するためのフォーマット処理
 */

export const useFormatDateTime = () => {
  /**
   * 相対時刻または絶対時刻でフォーマットした日時文字列を返す
   * @param dateString - ISO文字列形式の日時、またはundefined
   * @param now - 現在時刻（テスト用に注入可能）
   * @returns フォーマットされた日時文字列
   */
  const formatRelativeTime = (
    dateString: string | undefined,
    now?: Date,
  ): string => {
    // 無効な入力の場合は'-'を返す
    if (!dateString || dateString === '') {
      return '-'
    }

    // 日付のパース
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '-'
    }

    // 現在時刻を取得（テスト用に注入可能）
    const currentTime = now || new Date()

    // 時間差を計算（ミリ秒）
    const diffMs = currentTime.getTime() - date.getTime()

    // 未来の時刻の場合は絶対時刻フォーマットで処理
    if (diffMs < 0) {
      return formatAbsoluteTime(date, currentTime)
    }

    // 同じ日かどうかを判定（日付境界で絶対時刻に切り替え）
    const isSameDay
      = date.getFullYear() === currentTime.getFullYear()
        && date.getMonth() === currentTime.getMonth()
        && date.getDate() === currentTime.getDate()

    if (isSameDay) {
      // 同じ日の場合は相対時刻で表示
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)

      if (diffHours < 1) {
        if (diffMinutes < 1) {
          return '数秒前'
        }
        return `${diffMinutes}分前`
      }
      return `${diffHours}時間前`
    }

    // 違う日の場合は絶対時刻フォーマットで処理
    return formatAbsoluteTime(date, currentTime)
  }

  /**
   * 絶対時刻でフォーマットした日時文字列を返す
   * @param date - フォーマット対象の日時
   * @param currentTime - 現在時刻
   * @returns フォーマットされた日時文字列
   */
  const formatAbsoluteTime = (date: Date, currentTime: Date): string => {
    // 同じ日かどうかを判定
    const isSameDay
      = date.getFullYear() === currentTime.getFullYear()
        && date.getMonth() === currentTime.getMonth()
        && date.getDate() === currentTime.getDate()

    if (isSameDay) {
      // 今日の場合：HH:MM形式
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    // 昨日かどうかを判定
    const yesterday = new Date(currentTime)
    yesterday.setDate(currentTime.getDate() - 1)
    const isYesterday
      = date.getFullYear() === yesterday.getFullYear()
        && date.getMonth() === yesterday.getMonth()
        && date.getDate() === yesterday.getDate()

    if (isYesterday) {
      // 昨日の場合：昨日 HH:MM形式
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `昨日 ${hours}:${minutes}`
    }

    // 同じ年かどうかを判定
    const isSameYear = date.getFullYear() === currentTime.getFullYear()

    if (isSameYear) {
      // 今年の場合：M月D日形式
      const month = date.getMonth() + 1 // 0ベースなので+1
      const day = date.getDate()
      return `${month}月${day}日`
    }

    // 去年以前の場合：YYYY年M月D日形式
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  /**
   * 完全な日時フォーマットを取得する（tooltip用等）
   * @param dateString - ISO文字列形式の日時、またはundefined
   * @returns 完全フォーマットされた日時文字列 (YYYY年M月D日(曜日) HH:MM形式)
   */
  const formatFullDateTime = (dateString: string | undefined): string => {
    if (!dateString || dateString === '') {
      return '-'
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '-'
    }

    // YYYY年M月D日(曜日) HH:MM形式で返す
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${year}年${month}月${day}日(${weekday}) ${hours}:${minutes}`
  }

  return {
    formatRelativeTime,
    formatFullDateTime,
  }
}
