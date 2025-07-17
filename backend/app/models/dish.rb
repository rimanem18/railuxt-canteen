# frozen_string_literal: true

# 食堂で提供される料理を管理するモデル
# 料理名、価格、説明等の基本情報を持ち、注文との関連を管理する
class Dish < ApplicationRecord
  # 料理が削除されても、過去の売上分析のために注文履歴は残す必要がある
  # そのため意図的に dependent: :destroy は設定しない
  # 注文データは分析レポートやユーザーの注文履歴表示で必要となるため
  has_many :orders # rubocop:disable Rails/HasManyOrHasOneDependent
end
