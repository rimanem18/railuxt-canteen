/**
 * 日時フォーマット機能のテストファイル
 * TDDのRed-Green-Refactorサイクルに従って実装
 */

import { describe, it, expect } from 'vitest'
import { useFormatDateTime } from '~/composables/useFormatDateTime'

describe('useFormatDateTime', () => {
  describe('基本的な無効値処理', () => {
    it('undefinedを渡した場合、"-"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const result = formatRelativeTime(undefined)
      expect(result).toBe('-')
    })

    it('空文字列を渡した場合、"-"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const result = formatRelativeTime('')
      expect(result).toBe('-')
    })

    it('不正な日付文字列を渡した場合、"-"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const result = formatRelativeTime('invalid-date')
      expect(result).toBe('-')
    })
  })

  describe('相対時刻フォーマット', () => {
    it('30秒前の場合、"数秒前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 30 * 1000) // 30秒前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('数秒前')
    })

    it('10分前の場合、"10分前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 10 * 60 * 1000) // 10分前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('10分前')
    })

    it('2時間前の場合、"2時間前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2時間前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('2時間前')
    })

    it('59秒前の場合、"数秒前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 59 * 1000) // 59秒前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('数秒前')
    })

    it('1分前の場合、"1分前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 60 * 1000) // 1分前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('1分前')
    })

    it('59分前の場合、"59分前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 59 * 60 * 1000) // 59分前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('59分前')
    })

    it('1時間前の場合、"1時間前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 60 * 60 * 1000) // 1時間前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('1時間前')
    })

    it('23時間前（同じ日）の場合、"23時間前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T23:59:00.000Z')
      const targetDate = new Date('2024-07-31T01:00:00.000Z') // 約23時間前、同じ日
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('22時間前')
    })
  })

  describe('絶対時刻フォーマット', () => {
    it('昨日の場合、"昨日 14:30"形式を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      yesterday.setHours(14, 30, 0, 0)
      const result = formatRelativeTime(yesterday.toISOString(), now)
      expect(result).toBe('昨日 14:30')
    })

    it('今年の他の日の場合、"7月29日"形式を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const thisYear = new Date('2024-07-29T14:30:00.000Z')
      const result = formatRelativeTime(thisYear.toISOString(), now)
      expect(result).toBe('7月29日')
    })

    it('去年以前の場合、"2023年7月31日"形式を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const lastYear = new Date('2023-07-31T14:30:00.000Z')
      const result = formatRelativeTime(lastYear.toISOString(), now)
      expect(result).toBe('2023年7月31日')
    })

    it('今年の1月1日の場合、"1月1日"形式を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const newYear = new Date('2024-01-01T00:00:00.000Z')
      const result = formatRelativeTime(newYear.toISOString(), now)
      expect(result).toBe('1月1日')
    })

    it('今年の12月31日の場合、"12月31日"形式を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const yearEnd = new Date('2024-12-31T23:59:00.000Z')
      const result = formatRelativeTime(yearEnd.toISOString(), now)
      expect(result).toBe('12月31日')
    })
  })

  describe('エッジケース対応', () => {
    it('ちょうど60秒前の場合、"1分前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 60 * 1000) // ちょうど60秒前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('1分前')
    })

    it('ちょうど3600秒前（1時間前）の場合、"1時間前"を返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const targetDate = new Date(now.getTime() - 3600 * 1000) // ちょうど3600秒前
      const result = formatRelativeTime(targetDate.toISOString(), now)
      expect(result).toBe('1時間前')
    })

    it('日付境界を跨ぐ場合（23:59→00:01）、絶対時刻フォーマットを返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T00:01:00.000Z')
      const yesterday = new Date('2024-07-30T23:59:00.000Z')
      const result = formatRelativeTime(yesterday.toISOString(), now)
      expect(result).toBe('昨日 23:59')
    })

    it('未来の時刻（同じ年）の場合、絶対時刻フォーマットを返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const future = new Date('2024-08-01T14:30:00.000Z')
      const result = formatRelativeTime(future.toISOString(), now)
      expect(result).toBe('8月1日')
    })

    it('未来の時刻（来年）の場合、絶対時刻フォーマットを返すこと', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const nextYear = new Date('2025-01-01T00:00:00.000Z')
      const result = formatRelativeTime(nextYear.toISOString(), now)
      expect(result).toBe('2025年1月1日')
    })

    it('うるう年の2月29日の場合、正しく処理されること', () => {
      const { formatRelativeTime } = useFormatDateTime()
      const now = new Date('2024-07-31T14:30:00.000Z')
      const leapDay = new Date('2024-02-29T12:00:00.000Z')
      const result = formatRelativeTime(leapDay.toISOString(), now)
      expect(result).toBe('2月29日')
    })

    it('現在時刻を省略した場合、現在時刻が使用されること', () => {
      const { formatRelativeTime } = useFormatDateTime()
      // 現在時刻を省略して呼び出し
      const result = formatRelativeTime('invalid-date')
      expect(result).toBe('-') // 無効な日付なので'-'が返される
    })
  })

  describe('完全日時フォーマット', () => {
    it('有効な日時を渡した場合、正しい完全フォーマットを返すこと', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime('2023-12-25T15:30:00.000Z')
      expect(result).toBe('2023年12月25日(月) 15:30')
    })

    it('うるう年の日付を正しく処理できること', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime('2024-02-29T09:15:00.000Z')
      expect(result).toBe('2024年2月29日(木) 09:15')
    })

    it('undefinedを渡した場合、"-"を返すこと', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime(undefined)
      expect(result).toBe('-')
    })

    it('空文字列を渡した場合、"-"を返すこと', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime('')
      expect(result).toBe('-')
    })

    it('不正な日付文字列を渡した場合、"-"を返すこと', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime('invalid-date')
      expect(result).toBe('-')
    })

    it('曜日が正しく表示されること', () => {
      const { formatFullDateTime } = useFormatDateTime()
      // 2023年12月24日は日曜日
      const sunday = formatFullDateTime('2023-12-24T12:00:00.000Z')
      expect(sunday).toBe('2023年12月24日(日) 12:00')

      // 2023年12月30日は土曜日
      const saturday = formatFullDateTime('2023-12-30T18:45:00.000Z')
      expect(saturday).toBe('2023年12月30日(土) 18:45')
    })

    it('時刻が2桁でパディングされること', () => {
      const { formatFullDateTime } = useFormatDateTime()
      const result = formatFullDateTime('2023-01-05T03:07:00.000Z')
      expect(result).toBe('2023年1月5日(木) 03:07')
    })
  })
})
