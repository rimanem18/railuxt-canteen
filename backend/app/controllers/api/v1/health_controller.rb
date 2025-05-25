# frozen_string_literal: true

module Api
  module V1
    class HealthController < ApplicationController
      # 単純にヘルスチェック用のエンドポイントを作成
      def show
        render json: { status: 'ok', name: '太郎' }, status: :ok
      end
    end
  end
end
