# db/seeds.rb

# ユーザー
[
  { name: 'デモシェフ',  role: 'admin' },
  { name: 'デモユーザー', role: 'user' }
].each do |attrs|
  # `find_or_create_by!`を使用して、ユーザーが存在しない場合は作成
  User.find_or_create_by!(name: attrs[:name]) do |u|
    u.role = attrs[:role]
  end
end

# 料理
[
  { name: 'チャーハン', price: 700 },
  { name: '餃子', price: 450 },
  { name: '麻婆豆腐', price: 800 }
].each do |attrs|
  # `find_or_create_by!`を使用して、料理が存在しない場合は作成
  Dish.find_or_create_by!(name: attrs[:name]) do |d|
    d.price = attrs[:price]
  end
end
