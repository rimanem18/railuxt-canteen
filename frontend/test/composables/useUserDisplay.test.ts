import { describe, it, expect } from 'vitest'
import { useUserDisplay } from '~/composables/useUserDisplay'

describe('useUserDisplay', () => {
  it('composableが正常にインポートできる', () => {
    expect(useUserDisplay).toBeDefined()
    expect(typeof useUserDisplay).toBe('function')
  })

  describe('getUserDisplayName', () => {
    it('名前がある場合はその名前を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = { name: '田中太郎' }
      expect(getUserDisplayName(user)).toBe('田中太郎')
    })

    it('名前が空文字の場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = { name: '' }
      expect(getUserDisplayName(user)).toBe('名前なし')
    })

    it('名前がスペースのみの場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = { name: '   ' }
      expect(getUserDisplayName(user)).toBe('名前なし')
    })

    it('名前がundefinedの場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = { name: undefined }
      expect(getUserDisplayName(user)).toBe('名前なし')
    })

    it('userがundefinedの場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      expect(getUserDisplayName(undefined)).toBe('名前なし')
    })

    it('userがnullの場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      expect(getUserDisplayName(null)).toBe('名前なし')
    })

    it('nameプロパティがないuserオブジェクトの場合は「名前なし」を返す', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = {} as { name?: string }
      expect(getUserDisplayName(user)).toBe('名前なし')
    })

    it('前後にスペースがある名前の場合は正しく処理される', () => {
      const { getUserDisplayName } = useUserDisplay()
      const user = { name: '  田中太郎  ' }
      // trim()で前後のスペースが除去され、有効な名前として扱われる
      expect(getUserDisplayName(user)).toBe('  田中太郎  ')
    })
  })
})
