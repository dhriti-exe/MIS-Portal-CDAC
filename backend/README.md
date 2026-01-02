# Training & Enrollment Management System - Backend

FastAPI backend for the Training & Enrollment Management System.

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Poetry (recommended) or pip

### Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   # OR
   poetry install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE training_enrollment;
   ```

4. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

5. **Seed master data (optional):**
   ```bash
   python scripts/seed_master_data.py
   ```

6. **Run the server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── core/          # Core configuration, auth, security
│   ├── db/            # Database session and base
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── routers/       # API routers
│   └── main.py        # FastAPI app entry point
├── alembic/           # Database migrations
├── scripts/           # Utility scripts
└── requirements.txt   # Python dependencies
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback:
```bash
alembic downgrade -1
```

