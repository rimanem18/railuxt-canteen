up:
	docker compose up -d
down:
	docker compose down --remove-orphans
restart:
	docker compose down
	docker compose up -d
build:
	docker compose build
app:
	docker compose exec app bash
web:
	docker compose exec web bash
db:
	docker compose exec db bash
ps:
	docker compose ps
logs:
	docker compose logs -f
fmt:
	docker compose exec app bash -c "bundle exec rubocop -a"
	docker compose exec web bash -c "npm run format"
init:
	# 環境変数コピー
	test -f .env || cp .env.example .env

	# Gem や npm 依存インストール
	docker compose run --rm app bash -lc "bundle check || bundle install"
	docker compose run --rm web bash -lc "npm ci"

	# pre-commit フックを初回セットアップ
# 	test -f .git/hooks/pre-commit || cp scripts/pre-commit .git/hooks/pre-commit
# 	chmod +x .git/hooks/pre-commit

	@echo "✨ init complete. 次は make up で起動してください"
db-setup:
	docker compose up -d db
	sleep 3
	docker compose exec -T app bash -lc "bundle exec rails db:create"
	docker compose exec -T app bash -lc "bundle exec rails db:create RAILS_ENV=test"
	docker compose exec -T app bash -lc "bundle exec rails db:migrate"
	docker compose exec -T app bash -lc "bundle exec rails db:migrate RAILS_ENV=test"
	docker compose exec -T app bash -lc "bundle exec rails db:seed"
	@echo "✨ DB setup complete"
amend:
	git commit --amend --no-edit
