# 全てのAPIコントローラーの基底クラス
# DeviseTokenAuthによるトークンベース認証を提供し、API専用のレスポンス形式を統一する
class ApplicationController < ActionController::API
  # DeviseTokenAuthのトークン認証機能を有効化
  # リクエストヘッダーからトークンを読み取り、current_userを設定する
  # フロントエンドとのステートレスな認証を実現するために必要
  include DeviseTokenAuth::Concerns::SetUserByToken
end
