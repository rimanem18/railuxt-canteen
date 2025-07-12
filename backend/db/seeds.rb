# db/seeds.rb

# ユーザー
users = [
  { name: 'ユーザー1', email: 'user1@example.com', password: 'password123' },
  { name: 'ユーザー2', email: 'user2@example.com', password: 'password456' }
]
users.each do |attrs|
  User.find_or_create_by!(email: attrs[:email]) do |u|
    u.name = attrs[:name]
    u.password = attrs[:password]
    u.password_confirmation = attrs[:password]
    u.provider = 'email'
    u.uid = attrs[:email]
  end
end

# 料理
dishes = [
  { name: 'チャーハン', price: 700 },
  { name: '餃子', price: 450 },
  { name: '麻婆豆腐', price: 800 }
]
dishes.each do |attrs|
  # `find_or_create_by!`を使用して、料理が存在しない場合は作成
  Dish.find_or_create_by!(name: attrs[:name]) do |d|
    d.price = attrs[:price]
  end
end
