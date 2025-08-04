# frozen_string_literal: true

FactoryBot.define do
  factory :order do
    association :user
    association :dish
    quantity { 1 }
    status { :pending }
  end
end
