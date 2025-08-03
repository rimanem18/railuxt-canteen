import { describe, it, expect } from 'vitest'
import { useOrderStatus } from '~/composables/useOrderStatus'

describe('useOrderStatus', () => {
  describe('ステータスラベルの取得', () => {
    it('既知のステータスに対して正しいラベルを返す', () => {
      const pendingStatus = useOrderStatus('pending')
      expect(pendingStatus.getStatusLabel()).toBe('未提供')

      const confirmedStatus = useOrderStatus('confirmed')
      expect(confirmedStatus.getStatusLabel()).toBe('受付済み')

      const preparingStatus = useOrderStatus('preparing')
      expect(preparingStatus.getStatusLabel()).toBe('調理中')

      const readyStatus = useOrderStatus('ready')
      expect(readyStatus.getStatusLabel()).toBe('提供準備完了')

      const completedStatus = useOrderStatus('completed')
      expect(completedStatus.getStatusLabel()).toBe('提供済み')

      const cancelledStatus = useOrderStatus('cancelled')
      expect(cancelledStatus.getStatusLabel()).toBe('キャンセル')
    })

    it('未知のステータスに対してデフォルトラベルを返す', () => {
      const unknownStatus = useOrderStatus('unknown_status')
      expect(unknownStatus.getStatusLabel()).toBe('不明')
    })

    it('空文字に対してデフォルトラベルを返す', () => {
      const emptyStatus = useOrderStatus('')
      expect(emptyStatus.getStatusLabel()).toBe('不明')
    })
  })

  describe('ステータスクラスの取得', () => {
    it('既知のステータスに対して正しいCSSクラスを返す', () => {
      const pendingStatus = useOrderStatus('pending')
      expect(pendingStatus.getStatusClass()).toBe('bg-yellow-50 text-yellow-700 border border-yellow-200')

      const confirmedStatus = useOrderStatus('confirmed')
      expect(confirmedStatus.getStatusClass()).toBe('bg-blue-50 text-blue-700 border border-blue-200')

      const completedStatus = useOrderStatus('completed')
      expect(completedStatus.getStatusClass()).toBe('bg-gray-50 text-gray-600 border border-gray-200')
    })

    it('未知のステータスに対してデフォルトクラスを返す', () => {
      const unknownStatus = useOrderStatus('unknown_status')
      expect(unknownStatus.getStatusClass()).toBe('bg-gray-50 text-gray-600 border border-gray-200')
    })
  })

  describe('ステータスドットクラスの取得', () => {
    it('既知のステータスに対して正しいドットクラスを返す', () => {
      const pendingStatus = useOrderStatus('pending')
      expect(pendingStatus.getStatusDotClass()).toBe('bg-yellow-400')

      const confirmedStatus = useOrderStatus('confirmed')
      expect(pendingStatus.getStatusDotClass()).toBe('bg-yellow-400')

      const completedStatus = useOrderStatus('completed')
      expect(completedStatus.getStatusDotClass()).toBe('bg-gray-400')
    })

    it('未知のステータスに対してデフォルトドットクラスを返す', () => {
      const unknownStatus = useOrderStatus('unknown_status')
      expect(unknownStatus.getStatusDotClass()).toBe('bg-gray-400')
    })
  })

  describe('レスポンシブ設計への対応', () => {
    it('全てのメソッドが安定した値を返す', () => {
      const status = useOrderStatus('pending')

      // 複数回呼び出しても同じ値を返すことを確認
      const label1 = status.getStatusLabel()
      const label2 = status.getStatusLabel()
      expect(label1).toBe(label2)

      const class1 = status.getStatusClass()
      const class2 = status.getStatusClass()
      expect(class1).toBe(class2)

      const dotClass1 = status.getStatusDotClass()
      const dotClass2 = status.getStatusDotClass()
      expect(dotClass1).toBe(dotClass2)
    })
  })
})
