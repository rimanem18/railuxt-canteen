/**
 * ユーザー表示に関する機能を提供するcomposable
 * @returns ユーザー表示機能
 */
export const useUserDisplay = () => {
  /**
   * ユーザーの表示名を取得する
   * @param user - ユーザー情報
   * @returns 表示用の名前（名前がない場合は「名前なし」）
   */
  const getUserDisplayName = (user: { name?: string } | undefined | null): string => {
    if (!user?.name || user.name.trim() === '') {
      return '名前なし'
    }
    return user.name
  }

  return {
    getUserDisplayName,
  }
}
