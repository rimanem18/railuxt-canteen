class AddIndexesToOrders < ActiveRecord::Migration[7.0]
  def change
    # カーソルベースページネーション用インデックス
    # user_id と created_at の複合インデックス（降順）
    add_index :orders, [:user_id, :created_at], name: 'index_orders_on_user_and_created_at'
    
    # ステータスフィルタリング用インデックス
    # user_id, status, created_at の複合インデックス
    add_index :orders, [:user_id, :status, :created_at], name: 'index_orders_on_user_status_created'
    
    # 日付範囲フィルタリング用のcreated_atインデックス（既にuser_idとの複合があるので、単独は不要）
  end
end
