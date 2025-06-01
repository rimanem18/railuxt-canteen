Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health/show'

      resources :dishes,  only: [:index]
      resources :orders,  only: [:index, :create, :update]
    end
  end
end
