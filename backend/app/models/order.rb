# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :user
  belongs_to :dish

  validates :quantity, numericality: { greater_than: 0 }
end
