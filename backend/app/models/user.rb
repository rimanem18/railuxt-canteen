# frozen_string_literal: true

# ユーザー認証と注文管理を担当するモデル
# DeviseTokenAuthを使用してトークンベース認証を実装し、APIアクセスを管理する
class User < ApplicationRecord
  # DeviseTokenAuthを使用したトークンベース認証の設定
  # APIモードではセッションを利用しないため、:trackable, :rememberable, :omniauthable は除外する
  # :confirmable - メールアドレスの正当性確認を必須とする（セキュリティ要件）
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :confirmable

  # DeviseTokenAuthの機能を有効化（APIトークン認証に必要）
  include DeviseTokenAuth::Concerns::User

  # ユーザーが削除された場合、プライバシーポリシーに従い関連する注文もすべて削除する
  has_many :orders, dependent: :destroy
end
