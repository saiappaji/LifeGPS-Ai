"""
Simulation Engine for LifeGPS AI.

Generates future-career scenarios (best-case, expected, worst-case)
by combining deterministic heuristics from the decision engine with
AI-generated narratives from the Gemini service.
"""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from decision_engine.career_engine import analyse_skill_gap
from services.gemini_service import generate_future_simulation

logger = logging.getLogger(__name__)


async def simulate_future(
    session: AsyncSession,
    user_id: int,
    career_goal: str,
    timeline_months: int,
) -> dict[str, Any]:
    """Run a full future-career simulation.

    Steps:
        1. Pull the user's skill-gap analysis from the decision engine.
        2. Feed the analysis context into Gemini to produce three
           narrative scenarios (best, expected, worst).
        3. Return a response shaped for the ``/api/future-simulation``
           endpoint.

    Args:
        session: Active async DB session.
        user_id: ID of the user profile.
        career_goal: Target career role.
        timeline_months: Desired timeline in months.

    Returns:
        dict matching ``FutureSimulationResponse`` schema.
    """
    # Step 1 — gather context from the decision engine
    try:
        gap_data = await analyse_skill_gap(session, user_id, career_goal)
    except ValueError:
        logger.warning("User %d not found for simulation; using defaults.", user_id)
        gap_data = {
            "current_skills": [],
            "required_skills": [],
            "missing_skills": [],
            "readiness_score": 50.0,
            "career_path": None,
        }

    education = ""
    from models.models import UserProfile  # local import to avoid circular at module level
    user = await session.get(UserProfile, user_id)
    if user:
        education = user.education

    # Step 2 — ask Gemini for narrative scenarios
    simulation_result = await generate_future_simulation(
        career_goal=career_goal,
        current_skills=gap_data["current_skills"],
        timeline_months=timeline_months,
        education=education,
        readiness_score=gap_data["readiness_score"],
    )

    # Step 3 — shape response
    return {
        "career_goal": career_goal,
        "timeline_months": timeline_months,
        "scenarios": simulation_result.get("scenarios", {
            "best_case": _default_scenario(career_goal, "best"),
            "expected": _default_scenario(career_goal, "expected"),
            "worst_case": _default_scenario(career_goal, "worst"),
        }),
    }


def _default_scenario(career_goal: str, variant: str) -> dict[str, Any]:
    """Return a safe fallback scenario when AI generation fails."""
    salary_map = {
        "best": "$110,000 - $150,000",
        "expected": "$80,000 - $110,000",
        "worst": "$55,000 - $75,000",
    }
    desc_map = {
        "best": f"Exceptional performance leads to a senior {career_goal} role with strong compensation.",
        "expected": f"Steady progress results in a solid {career_goal} position at market rate.",
        "worst": f"Challenges slow progress but a junior {career_goal} role is attainable.",
    }
    return {
        "job_title": career_goal,
        "salary_range": salary_map.get(variant, "$70,000 - $100,000"),
        "certifications": ["Relevant industry certification"],
        "skills_acquired": ["Core technical skills"],
        "description": desc_map.get(variant, f"Transition into a {career_goal} role."),
    }
