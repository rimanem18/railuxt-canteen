# frozen_string_literal: true

FactoryBot.define do
  factory :dish do
    sequence(:name) { |n| "料理 #{n}" }
    price { 500 }
  end
end
