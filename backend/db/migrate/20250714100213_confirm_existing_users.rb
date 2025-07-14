class ConfirmExistingUsers < ActiveRecord::Migration[7.0]
  def up
    User.where(confirmed_at: nil).update_all(confirmed_at: Time.current)
  end

  def down
    # ロールバック処理は不要（開発環境での一時的な修正のため）
  end
end
