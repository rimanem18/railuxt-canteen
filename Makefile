up:
	docker compose up -d
down:
	docker compose down --volumes --remove-orphans
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
