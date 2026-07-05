"""
Database configuration for LifeGPS AI.

Provides async SQLAlchemy engine, session factory, and base class
for ORM models. Uses SQLite with aiosqlite for local development.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "sqlite+aiosqlite:///./lifegps.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


async def get_session() -> AsyncSession:
    """FastAPI dependency that yields an async database session.

    Yields:
        AsyncSession: A scoped async database session that is
        automatically closed after the request completes.
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Create all database tables defined by ORM models.

    Called once on application startup to ensure the schema exists.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
