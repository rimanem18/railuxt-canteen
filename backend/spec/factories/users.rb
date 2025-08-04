# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "Test User #{n}" }
    sequence(:email) { |n| "test#{n}@example.com" }
    sequence(:uid) { |n| "test#{n}@example.com" }
    provider { 'email' }
    password { 'password123' }
    confirmed_at { Time.current }
  end
end
