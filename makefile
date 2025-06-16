NODE_ENV ?= development
SHELL := bash
MAKEFLAGS += --no-print-directory

COMPOSE_FILE ?= compose.yaml
ifneq ("$(wildcard compose.override.yaml)","")
	COMPOSE_FILE := $(COMPOSE_FILE):compose.override.yaml
endif

DC ?= docker compose
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_FILE

### Docker
init: down build up

restart: down up

up:
	$(DC) up -d

stop:
	$(DC) stop

down:
	$(DC) down

build:
	$(DC) build

db:
	$(DC) exec -it postgres psql -U postgres
