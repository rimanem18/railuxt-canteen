# 全てのAPIコントローラーの基底クラス
# DeviseTokenAuthによるトークンベース認証を提供し、API専用のレスポンス形式を統一する
class ApplicationController < ActionController::API
  # DeviseTokenAuthのトークン認証機能を有効化
  # リクエストヘッダーからトークンを読み取り、current_userを設定する
  # フロントエンドとのステートレスな認証を実現するために必要
  include DeviseTokenAuth::Concerns::SetUserByToken

  # JSONフォーマットを強制してフォーマット判定エラーを防ぐ
  # リクエストが:htmlと判定されることでDeviseのセッション使用を防ぐ
  before_action :ensure_json_format

  private

  # リクエストフォーマットをJSONに強制する
  # フォーマットネゴシエーションの問題を根本から解決し、
  # Deviseがナビゲーショナルリクエストとして判定することを防ぐ
  def ensure_json_format
    request.format = :json
  end
end
