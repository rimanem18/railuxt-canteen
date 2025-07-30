# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Orders', type: :request do
  let(:user) { create(:user) }
  let(:dish) { create(:dish) }
  let(:auth_headers) { auth_headers_for(user) }

  describe 'GET /api/v1/orders' do
    it '注文一覧を取得できること' do
      get api_v1_orders_path, headers: auth_headers
      expect(response).to have_http_status(:success)
    end

    context 'パラメータなしの場合' do
      it 'デフォルトで10件の注文とnext_cursorが返されること' do
        # 15件の注文を作成（デフォルトの10件を超える）
        15.times do |i|
          create(:order,
                 user: user,
                 dish: dish,
                 quantity: 1,
                 status: :pending,
                 created_at: i.minutes.ago)
        end

        get api_v1_orders_path, headers: auth_headers
        expect(response).to have_http_status(:success)

        json_response = response.parsed_body
        # デフォルトで10件が返されることを確認
        expect(json_response['orders'].size).to eq(10), 'Should return 10 orders by default'
        # next_cursorが存在することを確認
        expect(json_response['next_cursor']).not_to be_nil, 'Should include next_cursor'
      end
    end

    context 'カーソルページネーション' do
      it 'カーソルを指定して次のページを取得できること' do
        # 15件の注文を作成
        orders = []
        15.times do |i|
          orders << create(:order,
                           user: user,
                           dish: dish,
                           quantity: 1,
                           status: :pending,
                           created_at: (i + 1).minutes.ago)
        end

        # 10番目の注文のcreated_atをカーソルとして使用
        cursor = orders[9].created_at.iso8601

        get api_v1_orders_path, params: { cursor: cursor }, headers: auth_headers
        expect(response).to have_http_status(:success)

        json_response = response.parsed_body
        # 残り5件が返されることを確認
        expect(json_response['orders'].size).to eq(5), 'Should return remaining 5 orders'
        # next_cursorがnilであることを確認
        expect(json_response['next_cursor']).to be_nil, 'Should not have next_cursor when no more data'
      end
    end

    context 'フィルタリング機能' do
      it 'ステータスで注文をフィルタリングできること' do
        # テストをクリーンにするため既存のデータを削除
        user.orders.destroy_all

        # 異なるステータスの注文を作成
        create(:order, user: user, dish: dish, quantity: 1, status: :pending)
        create(:order, user: user, dish: dish, quantity: 1, status: :completed)
        create(:order, user: user, dish: dish, quantity: 1, status: :pending)

        # completedステータスでフィルタリング
        get api_v1_orders_path, params: { status: 'completed' }, headers: auth_headers
        expect(response).to have_http_status(:success)

        json_response = response.parsed_body
        # completedの注文のみ返されることを確認
        expect(json_response['orders'].size).to eq(1), 'Should return only completed orders'
        expect(json_response['orders'][0]['status']).to eq('completed'), 'Order should be completed'
      end

      it '日付範囲で注文をフィルタリングできること' do
        # テストをクリーンにするため既存のデータを削除
        user.orders.destroy_all

        # 異なる日付の注文を作成
        create(:order,
               user: user, dish: dish, quantity: 1, status: :pending,
               created_at: 5.days.ago)
        recent_order = create(:order,
                              user: user, dish: dish, quantity: 1, status: :pending,
                              created_at: 1.day.ago)

        # 3日前から今日までの範囲でフィルタリング
        start_date = 3.days.ago.to_date
        end_date = Date.current

        get api_v1_orders_path,
            params: { start_date: start_date, end_date: end_date },
            headers: auth_headers
        expect(response).to have_http_status(:success)

        json_response = response.parsed_body
        # 期間内の注文のみ返されることを確認
        expect(json_response['orders'].size).to eq(1), 'Should return only orders in date range'
        expect(json_response['orders'][0]['id']).to eq(recent_order.id), 'Should return recent order'
      end
    end

    context 'セキュリティ' do
      it '他ユーザーの注文にアクセスできないこと' do
        # 他のユーザーを作成
        other_user = create(:user,
                            name: 'Other User',
                            email: 'other@example.com',
                            uid: 'other@example.com')

        # 他ユーザーの注文を作成
        other_order = create(:order, user: other_user, dish: dish, quantity: 1, status: :pending)

        # 自分の注文も作成
        my_order = create(:order, user: user, dish: dish, quantity: 1, status: :completed)

        get api_v1_orders_path, headers: auth_headers
        expect(response).to have_http_status(:success)

        json_response = response.parsed_body
        order_ids = json_response['orders'].map { |o| o['id'] }

        # 自分の注文のみアクセス可能であることを確認
        expect(order_ids).to include(my_order.id), 'Should include own orders'
        expect(order_ids).not_to include(other_order.id), 'Should not include other users orders'
      end
    end
  end

  describe 'POST /api/v1/orders' do
    context 'パラメータなしの場合' do
      it 'パラメータなしの注文作成で422エラーが返されること' do
        post api_v1_orders_path, headers: auth_headers
        expect(response).to have_http_status(:bad_request) # パラメータなしなので400が返される
      end
    end

    context 'エラーハンドリング' do
      it '存在しない料理IDで適切にエラーハンドリングされること' do
        post api_v1_orders_path,
             params: { order: { dish_id: 99_999, quantity: 1 } },
             headers: auth_headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = response.parsed_body
        expect(json_response['errors']).to be_present, 'Should return errors'
      end
    end
  end

  describe 'PATCH /api/v1/orders/:id' do
    let(:order) { create(:order, user: user, dish: dish, quantity: 1) }

    context 'パラメータなしの場合' do
      it 'パラメータなしの注文更新で422エラーが返されること' do
        patch api_v1_order_path(order), headers: auth_headers
        expect(response).to have_http_status(:bad_request) # パラメータなしなので400が返される
      end
    end

    context 'ステータス遷移制御' do
      it '有効なステータス遷移が許可されること' do
        order = create(:order, user: user, dish: dish, quantity: 1, status: :pending)

        # pending -> confirmed（有効な遷移）
        patch api_v1_order_path(order),
              params: { order: { status: 'confirmed' } },
              headers: auth_headers
        expect(response).to have_http_status(:success)

        order.reload
        expect(order.status).to eq('confirmed')
      end

      it '無効なステータス遷移が拒否されること' do
        order = create(:order, user: user, dish: dish, quantity: 1, status: :completed)

        # completed -> pending（無効な遷移 - 完了済みからは戻れない）
        patch api_v1_order_path(order),
              params: { order: { status: 'pending' } },
              headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)

        json_response = response.parsed_body
        expect(json_response['errors']).to be_present, 'Should return validation errors'

        order.reload
        expect(order.status).to eq('completed'), 'Status should not change on invalid transition'
      end

      it '完了済み注文のステータス変更が禁止されること' do
        order = create(:order, user: user, dish: dish, quantity: 1, status: :completed)

        # completed -> pending（無効な遷移）
        patch api_v1_order_path(order),
              params: { order: { status: 'pending' } },
              headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)

        order.reload
        expect(order.status).to eq('completed'), 'Status should remain completed'
      end
    end

    context 'セキュリティ' do
      it '他ユーザーの注文を更新できないこと' do
        # 他のユーザーを作成
        other_user = create(:user,
                            name: 'Other User',
                            email: 'other2@example.com',
                            uid: 'other2@example.com')

        # 他ユーザーの注文を作成
        other_order = create(:order, user: other_user, dish: dish, quantity: 1, status: :pending)

        # 他ユーザーの注文を更新しようとする
        patch api_v1_order_path(other_order),
              params: { order: { status: 'completed' } },
              headers: auth_headers

        # 404エラーが返されることを確認
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
