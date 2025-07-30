import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * テスト用MSWサーバーの設定
 * Node.js環境（Vitest）でAPIモックを提供する
 */
export const server = setupServer(...handlers)

/**
 * テスト開始前にサーバーを起動
 */
export const startServer = () => {
  server.listen({
    onUnhandledRequest: 'warn',
  })
}

/**
 * テスト終了後にサーバーを停止
 */
export const stopServer = () => {
  server.close()
}

/**
 * 各テスト後にリクエストハンドラーをリセット
 */
export const resetServerHandlers = () => {
  server.resetHandlers()
}
