# Dockerized Development & Deployment

## Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/) (comes with Docker Desktop)

## Quick Start

1. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Database: localhost:5432 (PostgreSQL)

2. **Stop all services:**
   ```sh
   docker-compose down
   ```

3. **Rebuild after code changes:**
   ```sh
   docker-compose up --build
   ```

## Notes
- Backend migrations (Alembic) run automatically on backend container start.
- Environment variables for DB are set in `docker-compose.yml`.
- To run backend/DB/Frontend separately, use their respective Dockerfiles.
- For production, review security and environment settings.

## Troubleshooting
- If you get port conflicts, stop other services using 3000, 8000, or 5432.
- For persistent DB data, Docker volume `postgres_data` is used.
- Logs can be viewed with:
  ```sh
  docker-compose logs backend
  docker-compose logs frontend
  docker-compose logs db
  ```

---

For more details, see the main README.md or each service's README.
