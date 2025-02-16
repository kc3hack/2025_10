front:
	cd frontend && npm run dev

back:
	cd backend && npm run dev

install:
	cd frontend && npm install
	cd backend && npm install

up:
	docker compose up

build:
	docker compose build --no-cache

down:
	docker compose down

sb:
	cd frontend && npm run storybook
