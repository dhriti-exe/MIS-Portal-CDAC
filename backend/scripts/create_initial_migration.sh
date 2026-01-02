#!/bin/bash
# Script to create initial Alembic migration
# Run this after setting up your database

echo "Creating initial Alembic migration..."
alembic revision --autogenerate -m "Initial migration: Create all tables from MySQL schema"

echo "Migration created! Review the migration file in alembic/versions/"
echo "Then run: alembic upgrade head"

