/**
 * 利用するHTTPメソッドを明示的に定義
 * 大文字・小文字両方をサポートして互換性を保つ
 */
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'

/**
 * useApi専用のオプション型定義
 * 実際に使用される機能のみを定義
 */
export interface UseApiOptions {
  /** HTTPメソッド */
  method?: HttpMethod
  /** リクエストボディ */
  body?: unknown
  /** リクエストヘッダー */
  headers?: Record<string, string>
  /** クエリパラメータ */
  query?: Record<string, string | number | boolean>
}
