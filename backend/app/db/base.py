"""
SQLAlchemy base and session configuration
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base



def get_async_engine(database_url: str, echo: bool = False):
    return create_async_engine(
        database_url,
        echo=echo,
        future=True,
    )


def get_async_session_local(engine):
    return async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )

Base = declarative_base()

