# Backend Dockerfile for FastAPI app
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose port (default FastAPI port)
EXPOSE 8000

# Run Alembic migrations on container start, then start FastAPI
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
