"""
Database session dependency
"""

from app.db.base import get_async_engine, get_async_session_local
from app.core.config import settings


engine = get_async_engine(settings.DATABASE_URL)
AsyncSessionLocal = get_async_session_local(engine)

async def get_db():
    """Dependency for getting database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

