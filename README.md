# Training & Enrollment Management System

A full-stack web application for managing training enrollments, applicants, and administrative workflows. Built with FastAPI (backend), React + TypeScript (frontend), PostgreSQL, and Docker for easy development and deployment.

---

## Features
- Applicant onboarding and profile management
- Application submission and tracking
- Enrollment management
- News and notifications
- Admin and center dashboards
- Secure authentication (JWT)
- Responsive UI with TailwindCSS
- Dockerized for local development

---

## Project Structure
```
CDAC/
├── backend/         # FastAPI backend (Python)
│   ├── app/         # Main backend app (models, routers, schemas, etc.)
│   ├── scripts/     # DB setup and seed scripts
│   ├── requirements.txt
│   └── ...
├── frontend/        # React frontend (TypeScript)
│   ├── src/         # Source code (components, pages, api, store)
│   ├── public/
│   └── ...
├── docker-compose.yml
├── DOCKER.md        # Docker usage guide
├── README.md        # (this file)
└── ...
```

---

## Quick Start (Docker)

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

3. **Logs:**
   ```sh
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs db
   ```

---

## Backend Setup (Manual)

1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   # OR
   poetry install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and update DB credentials.
3. **Create database:**
   ```sql
   CREATE DATABASE training_enrollment;
   ```
4. **Run migrations:**
   ```sh
   alembic upgrade head
   ```
5. **Seed master data:**
   ```sh
   python scripts/seed_master_data.py
   ```
6. **Start server:**
   ```sh
   uvicorn app.main:app --reload --port 8000
   ```
7. **API Docs:**
   - Swagger: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

---

## Frontend Setup (Manual)

1. **Install dependencies:**
   ```sh
   npm install
   # OR
   yarn install
   ```
2. **Configure environment:**
   - Create `.env` with:
     ```env
     VITE_API_BASE_URL=http://localhost:8000
     ```
3. **Start dev server:**
   ```sh
   npm run dev
   # OR
   yarn dev
   ```
   - App: http://localhost:3000

4. **Build for production:**
   ```sh
   npm run build
   # OR
   yarn build
   ```

---

## Troubleshooting
- Ensure ports 3000 (frontend), 8000 (backend), and 5432 (db) are free.
- For persistent DB data, Docker volume `postgres_data` is used.
- If you change environment variables, restart the containers.

---

## License
MIT
