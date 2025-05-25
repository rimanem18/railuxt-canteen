Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health/show'
    end
  end
  get '/name', to: ->(_env) { [200, { 'Content-Type' => 'application/json' }, [{ name: '太郎' }.to_json]] }
end
