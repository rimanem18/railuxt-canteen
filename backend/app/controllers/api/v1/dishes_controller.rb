# frozen_string_literal: true

module Api
  module V1
    # 料理情報のAPI管理を担当するコントローラー
    # 提供可能な料理一覧の取得機能を提供する
    class DishesController < ApplicationController
      # 料理一覧取得API
      # GET /api/v1/dishes
      # 現在提供可能なすべての料理を返却する
      # 認証は不要（未ログインユーザーもメニューを閲覧可能）
      def index
        # 全ての料理を取得
        # 将来的には営業時間や在庫状況による絞り込みが必要になる可能性がある
        dishes = Dish.all
        render json: dishes, status: :ok
      end
    end
  end
end
