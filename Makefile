# LOC dev convenience targets
COMPOSE = docker compose

up:            ## Start the full stack (hot reload)
	$(COMPOSE) up

upd:           ## Start detached
	$(COMPOSE) up -d

down:          ## Stop and remove containers
	$(COMPOSE) down

logs:          ## Tail all logs
	$(COMPOSE) logs -f

build:         ## Rebuild images
	$(COMPOSE) build

migrate:       ## Apply Alembic migrations
	$(COMPOSE) exec backend uv run alembic upgrade head

makemigration: ## Autogenerate a migration: make makemigration m="add experiences"
	$(COMPOSE) exec backend uv run alembic revision --autogenerate -m "$(m)"

seed:          ## Populate the DB with development seed data
	$(COMPOSE) exec backend uv run python -m scripts.seed

test:          ## Run backend tests
	$(COMPOSE) exec backend uv run pytest -q

shell-backend: ## Shell into backend
	$(COMPOSE) exec backend sh

shell-db:      ## psql into the database
	$(COMPOSE) exec db psql -U loc -d loc

prod:          ## Build + run the production stack
	$(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d --build

.PHONY: up upd down logs build migrate makemigration seed test shell-backend shell-db prod
