compose-up: docker-compose.yaml
		docker-compose up -d --build


compose-down:
		docker-compose down --remove-orphans
