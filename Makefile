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
	docker compose up --build

down:
	docker compose down

