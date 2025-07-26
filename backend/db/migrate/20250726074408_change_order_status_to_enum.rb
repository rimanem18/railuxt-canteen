class ChangeOrderStatusToEnum < ActiveRecord::Migration[7.0]
  def up
    # 既存のデフォルト値を削除
    change_column_default :orders, :status, nil
    
    # statusカラムをbooleanからintegerに変更
    # ActiveRecord::Enumで使用するため、integer型にする
    # PostgreSQLではUSING句が必要（false→0, true→4への変換）
    change_column :orders, :status, :integer, 
                  null: false, 
                  using: 'CASE WHEN status = true THEN 4 ELSE 0 END'
    
    # 新しいデフォルト値を設定
    change_column_default :orders, :status, 0
  end

  def down
    # デフォルト値を削除
    change_column_default :orders, :status, nil
    
    # ロールバック時はintegerからbooleanに戻す
    change_column :orders, :status, :boolean,
                  null: false,
                  using: 'CASE WHEN status = 4 THEN true ELSE false END'
    
    # 元のデフォルト値を設定
    change_column_default :orders, :status, false
  end
end
