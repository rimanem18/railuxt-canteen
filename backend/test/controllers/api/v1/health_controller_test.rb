# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class HealthControllerTest < ActionDispatch::IntegrationTest
      test 'should get show' do
        get api_v1_health_show_url
        assert_response :success
      end
    end
  end
end
