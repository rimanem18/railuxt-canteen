# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.references :dish, null: false, foreign_key: true
      t.integer :quantity, default: 1, null: false
      t.boolean :status, default: false, null: false

      t.timestamps
    end
  end
end
