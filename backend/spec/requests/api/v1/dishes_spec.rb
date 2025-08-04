# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Dishes', type: :request do
  describe 'GET /api/v1/dishes' do
    context '正常系: 料理一覧の取得' do
      before do
        # テストデータの独立性を確保するため、既存データをクリア
        Order.destroy_all
        Dish.destroy_all
        # テスト用データを作成
        create(:dish, name: 'カレーライス', price: 600)
        create(:dish, name: 'ラーメン', price: 700)
        get '/api/v1/dishes'
      end

      it 'ステータスコード200が返却される' do
        expect(response).to have_http_status(:ok)
      end

      it 'レスポンスボディが正しい形式で返却される' do
        # 期待するレスポンス形式: { data: [...] }
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('data')
        expect(json_response['data']).to be_an(Array)
      end

      it '作成した料理データが含まれている' do
        json_response = JSON.parse(response.body)
        dishes_data = json_response['data']
        
        expect(dishes_data.length).to eq(2)
        
        # 1つ目の料理を確認
        dish1_data = dishes_data.find { |d| d['name'] == 'カレーライス' }
        expect(dish1_data).to be_present
        expect(dish1_data['price']).to eq(600)
        
        # 2つ目の料理を確認
        dish2_data = dishes_data.find { |d| d['name'] == 'ラーメン' }
        expect(dish2_data).to be_present
        expect(dish2_data['price']).to eq(700)
      end

      it '料理データに必要な属性が含まれている' do
        json_response = JSON.parse(response.body)
        first_dish = json_response['data'].first
        
        expect(first_dish).to have_key('id')
        expect(first_dish).to have_key('name')
        expect(first_dish).to have_key('price')
        expect(first_dish).to have_key('created_at')
        expect(first_dish).to have_key('updated_at')
      end
    end

    context '境界値: 料理が存在しない場合' do
      before do
        # 既存のデータをクリアしてから新しい空の状態でテスト
        # 外部キー制約を考慮し、関連データも含めてクリア
        Order.destroy_all
        Dish.destroy_all
        get '/api/v1/dishes'
      end

      it 'ステータスコード200が返却される' do
        expect(response).to have_http_status(:ok)
      end

      it '空の配列が返却される' do
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('data')
        expect(json_response['data']).to eq([])
      end
    end
  end
end