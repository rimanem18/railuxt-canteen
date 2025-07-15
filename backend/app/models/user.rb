# frozen_string_literal: true

# ユーザー認証と注文管理を担当するモデル
# DeviseTokenAuthを使用してトークンベース認証を実装し、APIアクセスを管理する
class User < ApplicationRecord
  # DeviseTokenAuthを使用したトークンベース認証の設定
  # :confirmable - メールアドレスの正当性確認を必須とする（セキュリティ要件）
  # :trackable - ユーザーの最終ログイン時刻等を記録し、利用状況分析を可能にする（ビジネス要件）
  # :omniauthable - 将来的なSNS認証導入に備えて有効化
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable

  # DeviseTokenAuthの機能を有効化（APIトークン認証に必要）
  include DeviseTokenAuth::Concerns::User

  # ユーザーが削除された場合、プライバシーポリシーに従い関連する注文もすべて削除する
  has_many :orders, dependent: :destroy
end
