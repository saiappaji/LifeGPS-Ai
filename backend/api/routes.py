"""
API route handlers for LifeGPS AI.

All endpoints are mounted under ``/api`` via the ``router`` APIRouter.
Each handler orchestrates the decision engine, database, and Gemini
service, then returns a Pydantic response model.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.schemas import (
    ChatRequest,
    ChatResponse,
    FutureSimulationRequest,
    FutureSimulationResponse,
    ProfileRequest,
    ProfileResponse,
    RoadmapRequest,
    RoadmapResponse,
    RoutesRequest,
    RoutesResponse,
    SkillGapRequest,
    SkillGapResponse,
)
from database import get_session
from decision_engine.career_engine import analyse_profile, analyse_skill_gap
from models.models import ChatHistory, UserProfile
from services.gemini_service import (
    generate_career_routes,
    generate_chat_response,
    generate_profile_summary,
    generate_roadmap,
    generate_skill_gap_analysis,
)
from simulation_engine.simulation_engine import simulate_future

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["LifeGPS AI"])


# ────────────────────────────────────────────────────────────────────
# POST /api/profile
# ────────────────────────────────────────────────────────────────────

@router.post("/profile", response_model=ProfileResponse)
async def create_or_update_profile(
    body: ProfileRequest,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    """Create a new user profile or update an existing one (by email).

    1. Upsert the profile row.
    2. Run the decision-engine analysis (readiness score, skill gap).
    3. Ask Gemini for a profile summary and recommendations.
    4. Persist the readiness score & summary, then return the result.
    """
    # Check if profile already exists by email
    result = await session.execute(
        select(UserProfile).where(UserProfile.email == body.email)
    )
    user = result.scalar_one_or_none()

    if user is None:
        user = UserProfile(
            name=body.name,
            email=body.email,
            education=body.education,
            skills=body.skills,
            career_goal=body.career_goal,
            budget=body.budget,
            timeline_months=body.timeline_months,
        )
        session.add(user)
        await session.flush()  # get the auto-generated id
    else:
        user.name = body.name
        user.education = body.education
        user.skills = body.skills
        user.career_goal = body.career_goal
        user.budget = body.budget
        user.timeline_months = body.timeline_months
        await session.flush()

    # Decision engine
    analysis = await analyse_profile(session, user)
    readiness_score = analysis["readiness_score"]
    missing_skills = analysis["missing_skills"]

    # Gemini enrichment
    ai_result = await generate_profile_summary(
        name=user.name,
        education=user.education,
        skills=user.skills,
        career_goal=user.career_goal,
        budget=user.budget,
        timeline_months=user.timeline_months,
        readiness_score=readiness_score,
        skill_gap=missing_skills,
    )

    profile_summary = ai_result.get("profile_summary", "")
    skill_gap = ai_result.get("skill_gap", missing_skills)
    recommendations = ai_result.get("recommendations", [])

    # Persist computed values
    user.readiness_score = readiness_score
    user.profile_summary = profile_summary
    await session.flush()

    return ProfileResponse(
        user_id=user.id,
        readiness_score=readiness_score,
        profile_summary=profile_summary,
        skill_gap=skill_gap,
        recommendations=recommendations,
    )


# ────────────────────────────────────────────────────────────────────
# POST /api/skill-gap
# ────────────────────────────────────────────────────────────────────

@router.post("/skill-gap", response_model=SkillGapResponse)
async def skill_gap_analysis(
    body: SkillGapRequest,
    session: AsyncSession = Depends(get_session),
) -> SkillGapResponse:
    """Perform a detailed skill-gap analysis for a user's career goal."""
    try:
        gap_data = await analyse_skill_gap(session, body.user_id, body.career_goal)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    # AI-powered recommendations
    ai_result = await generate_skill_gap_analysis(
        current_skills=gap_data["current_skills"],
        career_goal=body.career_goal,
        required_skills=gap_data["required_skills"],
        missing_skills=gap_data["missing_skills"],
        readiness_score=gap_data["readiness_score"],
    )

    return SkillGapResponse(
        career_goal=body.career_goal,
        current_skills=gap_data["current_skills"],
        required_skills=gap_data["required_skills"],
        missing_skills=gap_data["missing_skills"],
        readiness_score=gap_data["readiness_score"],
        recommendations=ai_result.get("recommendations", []),
    )


# ────────────────────────────────────────────────────────────────────
# POST /api/routes
# ────────────────────────────────────────────────────────────────────

@router.post("/routes", response_model=RoutesResponse)
async def career_routes(
    body: RoutesRequest,
    session: AsyncSession = Depends(get_session),
) -> RoutesResponse:
    """Generate multiple learning routes toward a career goal."""
    user = await session.get(UserProfile, body.user_id)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User {body.user_id} not found.")

    ai_result = await generate_career_routes(
        career_goal=body.career_goal,
        current_skills=user.skills,
        budget=user.budget,
        timeline_months=user.timeline_months,
    )

    return RoutesResponse(routes=ai_result.get("routes", []))


# ────────────────────────────────────────────────────────────────────
# POST /api/roadmap
# ────────────────────────────────────────────────────────────────────

@router.post("/roadmap", response_model=RoadmapResponse)
async def career_roadmap(
    body: RoadmapRequest,
    session: AsyncSession = Depends(get_session),
) -> RoadmapResponse:
    """Generate a month-by-month learning roadmap."""
    try:
        gap_data = await analyse_skill_gap(session, body.user_id, body.career_goal)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    ai_result = await generate_roadmap(
        career_goal=body.career_goal,
        current_skills=gap_data["current_skills"],
        timeline_months=body.timeline_months,
        missing_skills=gap_data["missing_skills"],
    )

    return RoadmapResponse(
        career_goal=body.career_goal,
        timeline_months=body.timeline_months,
        roadmap=ai_result.get("roadmap", []),
    )


# ────────────────────────────────────────────────────────────────────
# POST /api/future-simulation
# ────────────────────────────────────────────────────────────────────

@router.post("/future-simulation", response_model=FutureSimulationResponse)
async def future_simulation(
    body: FutureSimulationRequest,
    session: AsyncSession = Depends(get_session),
) -> FutureSimulationResponse:
    """Simulate best/expected/worst career outcomes."""
    sim_result = await simulate_future(
        session=session,
        user_id=body.user_id,
        career_goal=body.career_goal,
        timeline_months=body.timeline_months,
    )
    return FutureSimulationResponse(**sim_result)


# ────────────────────────────────────────────────────────────────────
# POST /api/chat
# ────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    session: AsyncSession = Depends(get_session),
) -> ChatResponse:
    """Handle a chat message with career-advisor context."""
    # Load user context if available
    user_context = None
    user = await session.get(UserProfile, body.user_id)
    if user:
        user_context = {
            "name": user.name,
            "career_goal": user.career_goal,
            "skills": user.skills,
            "education": user.education,
        }

    # Convert history for Gemini
    history = [{"role": m.role, "content": m.content} for m in body.history]

    ai_result = await generate_chat_response(
        user_message=body.message,
        history=history,
        user_context=user_context,
    )

    # Persist messages
    session.add(ChatHistory(user_id=body.user_id, role="user", content=body.message))
    session.add(
        ChatHistory(
            user_id=body.user_id,
            role="assistant",
            content=ai_result.get("response", ""),
        )
    )
    await session.flush()

    return ChatResponse(
        response=ai_result.get("response", ""),
        suggestions=ai_result.get("suggestions", []),
    )
