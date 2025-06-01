# frozen_string_literal: true

module Api
  module V1
    class OrdersController < ApplicationController
      # 一覧表示アクション
      # GET /api/v1/orders
      def index
        # ・Orderモデルのレコードを、作成日時の降順で取得する
        # ・N+1問題を避けるために dish を includes で先読み込む
        orders = Order.includes(:dish).order(created_at: :desc)
        # ・JSON レスポンスとして、order の属性と紐づく dish の id・name・price を返す
        render json: orders.as_json(
          include: { dish: { only: [:id, :name, :price] } },
          only: [:id, :user_id, :quantity, :status, :created_at]
        ), status: :ok
      end

      # 作成アクション
      # POST /api/v1/orders
      # ・リクエストボディから dish_id と quantity を受け取り、新しい Order を生成する
      # ・現在は固定ユーザー（User.first）を user に紐づける設計
      # ・保存に成功したら 201 Created とともに作成された order を返却
      # ・バリデーションエラーなどで保存に失敗したら 422 Unprocessable Entity とエラーメッセージを返却
      def create
        order = Order.new(order_params.merge(user: User.first))

        if order.save
          render json: order, status: :created
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # 更新アクション（提供完了フラグの更新）
      # PATCH /api/v1/orders/:id
      # ・URLパラメータから該当 order のレコードを取得し、status を true（提供済み）に更新する
      # ・更新に成功したら 200 OK とともに更新済みの order を返却
      # ・更新に失敗したら 422 Unprocessable Entity とエラーメッセージを返却
      def update
        if @order.update(status: true)
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
        @order = Order.find(params[:id])
      end

      # ストロングパラメータ
      # ・リクエストボディの order 以下にある dish_id と quantity のみを許可
      # ・quantity は現状デフォルトで 1 固定想定だが、後々拡張の余地を残している
      def order_params
        params.require(:order).permit(:dish_id, :quantity)
      end
    end
  end
end
