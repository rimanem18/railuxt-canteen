# frozen_string_literal: true

class Dish < ApplicationRecord
  has_many :orders, dependent: :destroy
end
