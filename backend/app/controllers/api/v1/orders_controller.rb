# frozen_string_literal: true

module Api
  module V1
    class OrdersController < ApplicationController
      # 認証を必須とする
      before_action :authenticate_api_v1_user!
      # update を呼ぶ前に set_order が走って、@order をセットしてくれる
      before_action :set_order, only: [:update]

      # 一覧表示アクション
      # GET /api/v1/orders
      def index
        orders_query = build_orders_query

        # ページネーション処理
        limit = (params[:limit] || 10).to_i
        orders = orders_query.limit(limit + 1).to_a

        # 次のページ存在確認とカーソル生成
        next_cursor = calculate_next_cursor(orders, limit)

        render json: {
          orders: orders.map(&:as_json_for_api),
          next_cursor: next_cursor
        }.compact, status: :ok
      end

      # 作成アクション
      # POST /api/v1/orders
      # ・リクエストボディから dish_id と quantity を受け取り、新しい Order を生成する
      # ・現在ログインしているユーザーの order として作成する
      # ・保存に成功したら 201 Created とともに作成された order を返却
      # ・バリデーションエラーなどで保存に失敗したら 422 Unprocessable Entity とエラーメッセージを返却
      def create
        order = current_api_v1_user.orders.new(order_params)

        if order.save
          render json: order, status: :created
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # 更新アクション（注文ステータスの更新）
      # PATCH /api/v1/orders/:id
      # ・URLパラメータから該当 order のレコードを取得し、リクエストで指定されたstatusに更新する
      # ・更新に成功したら 200 OK とともに更新済みの order を返却
      # ・更新に失敗したら 422 Unprocessable Entity とエラーメッセージを返却
      def update
        if @order.update(order_update_params)
          render json: @order, status: :ok
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # before_action で利用するコールバック
      # ・params[:id] から Order レコードを取得して @order に格納
      # ・該当する order が存在しない場合は ActiveRecord::RecordNotFound が発生し、404 レスポンスになる
      def set_order
        @order = current_api_v1_user.orders.find(params[:id])
      end

      # ストロングパラメータ（注文作成用）
      # ・リクエストボディの order 以下にある dish_id と quantity のみを許可
      # ・quantity は現状デフォルトで 1 固定想定だが、後々拡張の余地を残している
      def order_params
        params.require(:order).permit(:dish_id, :quantity)
      end

      # ストロングパラメータ（注文更新用）
      # ・リクエストボディの order 以下にある status のみを許可
      # ・enumで定義されたステータス値のみが受け入れられる
      def order_update_params
        params.require(:order).permit(:status)
      end

      # 次のページのカーソルを計算する
      def calculate_next_cursor(orders, limit)
        has_next_page = orders.size > limit
        return unless has_next_page

        orders.pop # 余分な1件を削除
        orders.last&.created_at&.iso8601
      end

      # クエリビルダを使用して、注文の一覧を取得する
      def build_orders_query
        current_api_v1_user.orders
                           .includes(:dish, :user)
                           .filter_by_status(params[:status])
                           .filter_by_date_range(params[:start_date], params[:end_date])
                           .page_by_cursor(params[:cursor])
                           .order(created_at: :desc)
      end
    end
  end
end
