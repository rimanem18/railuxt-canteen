# frozen_string_literal: true

# ユーザーの料理注文を管理するモデル
# 注文数量、提供状況（status）、注文日時等を記録し、ユーザーと料理を関連付ける
class Order < ApplicationRecord
  # 有効な遷移パターンを定義
  VALID_STATUS_TRANSITIONS = {
    'pending' => %w[confirmed cancelled],
    'confirmed' => %w[preparing cancelled],
    'preparing' => %w[ready cancelled],
    'ready' => %w[completed],
    'completed' => [],  # 完了後は変更不可
    'cancelled' => []   # キャンセル後は変更不可
  }.freeze

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

  # ステータス遷移制御
  validate :status_transition_valid, on: :update, if: :status_changed?

  # カーソルベースページネーションのためのスコープ
  # 指定された日時より前の注文を取得（降順ソートを前提）
  scope :page_by_cursor, lambda { |cursor|
    return all if cursor.blank?

    where(created_at: ...Time.zone.parse(cursor))
  }

  # ステータスによるフィルタリングスコープ
  # 指定されたステータスの注文のみを取得
  scope :filter_by_status, lambda { |status|
    return all if status.blank?

    where(status: status)
  }

  # 日付範囲によるフィルタリングスコープ
  # 指定された期間内の注文を取得
  scope :filter_by_date_range, lambda { |start_date, end_date|
    scope = all
    if start_date.present?
      start_time = Date.parse(start_date.to_s).beginning_of_day
      scope = scope.where(created_at: start_time..)
    end
    if end_date.present?
      end_time = Date.parse(end_date.to_s).end_of_day
      scope = scope.where(created_at: ..end_time)
    end
    scope
  }

  private

  # ステータス遷移の妥当性をチェック
  def status_transition_valid
    return unless status_changed?

    previous_status = status_was
    current_status = status

    allowed_statuses = VALID_STATUS_TRANSITIONS[previous_status] || []

    return if allowed_statuses.include?(current_status)

    errors.add(:status, "Invalid status transition from #{previous_status} to #{current_status}")
  end
end
