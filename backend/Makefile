# Development environment variables
ENV_DEV ?= development
DOCKER_COMPOSE_DEV = docker compose -f docker/local/docker-compose.yml

# Production environment variables
ENV_PROD ?= production
DOCKER_COMPOSE_PROD = docker compose -f docker/production/docker-compose.yml

# Default target
.DEFAULT_GOAL := help

.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development commands
.PHONY: dev
dev: ## Start development environment
	$(DOCKER_COMPOSE_DEV) up --build -d

.PHONY: dev-down
dev-down: ## Stop development environment
	$(DOCKER_COMPOSE_DEV) down

.PHONY: dev-logs
dev-logs: ## View development logs
	$(DOCKER_COMPOSE_DEV) logs -f

.PHONY: dev-migrate
dev-migrate: ## Run database migrations in development
	$(DOCKER_COMPOSE_DEV) exec api npx prisma migrate dev

.PHONY: dev-seed
dev-seed: ## Seed development database
	$(DOCKER_COMPOSE_DEV) exec api npx prisma db seed

.PHONY: dev-shell
dev-shell: ## Open shell in development API container
	$(DOCKER_COMPOSE_DEV) exec api sh

# Production commands
.PHONY: prod
prod: ## Start production environment locally
	$(DOCKER_COMPOSE_PROD) up --build -d

.PHONY: prod-down
prod-down: ## Stop production environment
	$(DOCKER_COMPOSE_PROD) down

.PHONY: prod-logs
prod-logs: ## View production logs
	$(DOCKER_COMPOSE_PROD) logs -f

.PHONY: prod-migrate
prod-migrate: ## Run database migrations in production
	$(DOCKER_COMPOSE_PROD) exec api npx prisma migrate deploy

.PHONY: prod-shell
prod-shell: ## Open shell in production API container
	$(DOCKER_COMPOSE_PROD) exec api sh

# Testing commands
.PHONY: test
test: ## Run tests
	npm test

.PHONY: test-watch
test-watch: ## Run tests in watch mode
	npm run test:watch

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	npm run test:coverage

# Database commands
.PHONY: db-studio
db-studio: ## Start Prisma Studio
	npx prisma studio

.PHONY: db-reset
db-reset: ## Reset development database
	$(DOCKER_COMPOSE_DEV) down -v
	$(DOCKER_COMPOSE_DEV) up -d postgres
	sleep 5
	$(MAKE) dev-migrate
	$(MAKE) dev-seed

# Utility commands
.PHONY: clean
clean: ## Clean up all containers and volumes
	$(DOCKER_COMPOSE_DEV) down -v
	$(DOCKER_COMPOSE_PROD) down -v
	docker system prune -f

.PHONY: lint
lint: ## Run linter
	npm run lint

.PHONY: format
format: ## Format code
	npm run format

.PHONY: build
build: ## Build production image
	docker build -f docker/production/Dockerfile -t everything-app-backend:latest .

# AWS deployment commands (examples)
.PHONY: aws-login
aws-login: ## Login to AWS ECR
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

.PHONY: aws-push
aws-push: ## Push image to AWS ECR
	docker tag everything-app-backend:latest $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/everything-app-backend:latest
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/everything-app-backend:latest

.PHONY: aws-deploy
aws-deploy: ## Deploy to AWS ECS
	aws ecs update-service --cluster everything-app --service backend --force-new-deployment
