"""
LifeGPS AI — FastAPI Application Entry Point.

Responsibilities:
    • Configure CORS for the React frontend (http://localhost:3000).
    • Create database tables on startup.
    • Seed career-path reference data on first run.
    • Mount all API routes under /api.
    • Expose a health-check endpoint at GET /.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select

from api.routes import router as api_router
from database import async_session_maker, init_db
from models.models import CareerPath, SEED_CAREER_PATHS

# Load environment variables from .env file (if present)
load_dotenv()

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ────────────────────────────────────────────────────────────────────
# Lifespan — startup / shutdown hooks
# ────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler.

    On startup:
        1. Create all tables if they don't exist.
        2. Seed the ``career_paths`` table when it's empty.
    """
    logger.info("🚀 Starting LifeGPS AI backend …")

    # 1. Create tables
    await init_db()
    logger.info("✅ Database tables created / verified.")

    # 2. Seed career paths
    async with async_session_maker() as session:
        count_result = await session.execute(
            select(func.count()).select_from(CareerPath)
        )
        row_count = count_result.scalar_one()

        if row_count == 0:
            for data in SEED_CAREER_PATHS:
                session.add(CareerPath(**data))
            await session.commit()
            logger.info("🌱 Seeded %d career paths.", len(SEED_CAREER_PATHS))
        else:
            logger.info("📦 Career paths table already has %d rows — skipping seed.", row_count)

    yield  # Application runs

    logger.info("👋 Shutting down LifeGPS AI backend.")


# ────────────────────────────────────────────────────────────────────
# FastAPI app
# ────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="LifeGPS AI",
    description=(
        "AI-powered career guidance platform — analyse your skills, "
        "generate learning roadmaps, and simulate your future career."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


# ────────────────────────────────────────────────────────────────────
# Health check
# ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def health_check():
    """Simple health-check endpoint."""
    return {
        "status": "healthy",
        "service": "LifeGPS AI Backend",
        "version": "1.0.0",
    }
