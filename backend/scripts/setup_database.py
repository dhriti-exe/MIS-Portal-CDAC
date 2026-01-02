"""
Script to create the PostgreSQL database
Run this before running migrations
"""

import asyncio
import asyncpg
import os
from pathlib import Path

# Add parent directory to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings

async def create_database():
    """Create the database if it doesn't exist"""
    # Parse the database URL to get connection details
    # Format: postgresql+asyncpg://user:password@host:port/database
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "")
    
    # Extract components
    if "@" in db_url:
        auth_part, rest = db_url.split("@")
        user, password = auth_part.split(":")
        host_port, db_name = rest.split("/")
        if ":" in host_port:
            host, port = host_port.split(":")
        else:
            host = host_port
            port = "5432"
    else:
        print("Invalid DATABASE_URL format")
        return
    
    # Connect to postgres database to create our database
    try:
        conn = await asyncpg.connect(
            host=host,
            port=int(port),
            user=user,
            password=password,
            database="postgres"  # Connect to default postgres database
        )
        
        # Check if database exists
        db_exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", db_name
        )
        
        if not db_exists:
            # Create database
            await conn.execute(f'CREATE DATABASE "{db_name}"')
            print(f"[SUCCESS] Database '{db_name}' created successfully!")
        else:
            print(f"[INFO] Database '{db_name}' already exists")
        
        await conn.close()
        
    except Exception as e:
        print(f"[ERROR] Error creating database: {e}")
        print("\nPlease create the database manually:")
        print(f"  psql -U {user} -c 'CREATE DATABASE {db_name};'")
        print("\nOr using pgAdmin or any PostgreSQL client")

if __name__ == "__main__":
    asyncio.run(create_database())

