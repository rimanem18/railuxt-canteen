Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  namespace :api do
    namespace :v1 do
      get 'health/show'

      mount_devise_token_auth_for 'User', at: 'auth'

      resources :dishes,  only: [:index]
      resources :orders,  only: [:index, :create, :update]
    end
  end
end
