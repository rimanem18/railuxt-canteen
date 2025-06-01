# frozen_string_literal: true

module Api
  module V1
    class DishesController < ApplicationController
      # GET /api/v1/dishes
      def index
        dishes = Dish.all
        render json: dishes, status: :ok
      end
    end
  end
end
