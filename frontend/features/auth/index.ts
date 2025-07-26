/**
 * 認証機能の外部公開API
 * 他のfeatureから認証機能を利用する際は、このファイルを通してアクセスする
 */

// Components
export { default as AuthLoginForm } from './components/LoginForm.vue'

// Composables
export { useAuth } from './composables/useAuth'

// Middleware
export { default as authMiddleware } from '~/middleware/auth'

// Types
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthValidateResponse,
} from './types/index'

// Schemas (バリデーション用)
export {
  UserSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  AuthResponseSchema,
  AuthValidateResponseSchema,
} from './types/index'
