# frozen_string_literal: true

# ユーザーの料理注文を管理するモデル
# 注文数量、提供状況（status）、注文日時等を記録し、ユーザーと料理を関連付ける
class Order < ApplicationRecord
  # 注文は必ずユーザーに紐づく（ログインユーザーのみ注文可能）
  belongs_to :user

  # 注文は必ず特定の料理に紐づく（存在しない料理は注文できない）
  belongs_to :dish

  # 注文ステータスの定義
  # ActiveRecord::Enumを使用して、注文の進行状況を管理
  enum :status, {
    pending: 0,      # 未提供（デフォルト状態）
    confirmed: 1,    # 受付済み
    preparing: 2,    # 調理中
    ready: 3,        # 提供準備完了
    completed: 4,    # 提供済み
    cancelled: 5     # キャンセル
  }

  # 注文数量は1以上でなければならない
  # 0や負の数は業務上無効なデータとして扱い、システムエラーを防ぐため
  validates :quantity, numericality: { greater_than: 0 }

  # ステータスの存在チェック
  validates :status, presence: true
end
