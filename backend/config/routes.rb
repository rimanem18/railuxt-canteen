Rails.application.routes.draw do
  get "/name", to: ->(env) { [200, { "Content-Type" => "application/json" }, [{name: "太郎"}.to_json()]] }

  # 単純に JSON {"status":"OK"} を返すヘルスチェック
  get "/health", to: ->(env) { [200, { "Content-Type" => "application/json" }, [ { status: "OK" }.to_json ]] }
end
