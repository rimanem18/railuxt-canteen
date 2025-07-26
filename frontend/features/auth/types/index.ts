/**
 * 認証機能の型定義とスキーマ
 */

import { z } from 'zod'

// ====================
// 認証関連のスキーマ定義
// ====================

/**
 * ユーザー情報のスキーマ
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'ユーザー名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  image: z.string().url().nullable().optional(), // テストで使用されるプロパティ
  provider: z.string().optional(), // テストで使用されるプロパティ
  uid: z.string().optional(), // テストで使用されるプロパティ（認証用UID）
  allow_password_change: z.boolean().optional(), // テストで使用されるプロパティ（パスワード変更許可）
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

/**
 * ログインリクエストのスキーマ
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
})

/**
 * ユーザー登録リクエストのスキーマ
 */
export const RegisterRequestSchema = z
  .object({
    name: z.string().min(1, 'ユーザー名は必須です'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
    password_confirmation: z
      .string()
      .min(6, 'パスワード確認は6文字以上である必要があります'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'パスワードが一致しません',
    path: ['password_confirmation'],
  })

/**
 * 認証レスポンスのスキーマ
 */
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
  message: z.string().optional(),
})

/**
 * 認証検証レスポンスのスキーマ
 */
export const AuthValidateResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
})

// ====================
// 型推論のエクスポート
// ====================

export type User = z.infer<typeof UserSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type AuthValidateResponse = z.infer<typeof AuthValidateResponseSchema>
