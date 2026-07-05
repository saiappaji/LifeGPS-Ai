"""
Career Decision Engine for LifeGPS AI.

Provides deterministic logic for:
  • Career Readiness Score calculation
  • Skill-gap identification
  • Route cost / timeline fitting

The engine uses the ``career_paths`` reference table and the user's
profile to produce numeric scores that are then enriched by Gemini.
"""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import CareerPath, UserProfile

logger = logging.getLogger(__name__)


# ────────────────────────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────────────────────────

def _normalise(text: str) -> str:
    """Lower-case and strip a string for fuzzy matching."""
    return text.strip().lower()


async def find_best_career_path(
    session: AsyncSession, career_goal: str
) -> CareerPath | None:
    """Find the career-path row whose title best matches ``career_goal``.

    Uses exact match first, then substring / containment as a fallback.
    Returns ``None`` if no match is found.
    """
    goal_lower = _normalise(career_goal)

    result = await session.execute(select(CareerPath))
    all_paths = result.scalars().all()

    # 1. Exact match (case-insensitive)
    for path in all_paths:
        if _normalise(path.title) == goal_lower:
            return path

    # 2. Substring match
    for path in all_paths:
        title_lower = _normalise(path.title)
        if goal_lower in title_lower or title_lower in goal_lower:
            return path

    # 3. Token overlap (pick the path with the most common words)
    goal_tokens = set(goal_lower.split())
    best, best_score = None, 0
    for path in all_paths:
        title_tokens = set(_normalise(path.title).split())
        overlap = len(goal_tokens & title_tokens)
        if overlap > best_score:
            best, best_score = path, overlap

    return best if best_score > 0 else (all_paths[0] if all_paths else None)


# ────────────────────────────────────────────────────────────────────
# Core calculations
# ────────────────────────────────────────────────────────────────────

def compute_skill_match(
    user_skills: list[str], required_skills: list[str]
) -> tuple[float, list[str], list[str]]:
    """Calculate skill-match percentage and identify missing skills.

    Args:
        user_skills: Skills the user already has.
        required_skills: Skills required for the target career.

    Returns:
        A tuple of (match_percentage, matched_skills, missing_skills).
    """
    user_set = {_normalise(s) for s in user_skills}
    required_set = {_normalise(s) for s in required_skills}

    matched = user_set & required_set
    missing = required_set - user_set

    if not required_set:
        return 100.0, list(user_skills), []

    pct = (len(matched) / len(required_set)) * 100

    # Restore original casing from the required list
    req_map = {_normalise(s): s for s in required_skills}
    matched_original = [req_map[s] for s in matched if s in req_map]
    missing_original = [req_map[s] for s in missing if s in req_map]

    return round(pct, 1), matched_original, missing_original


def compute_readiness_score(
    skill_match: float,
    user_timeline: int,
    avg_timeline: int,
    user_budget: float,
    avg_training_cost: float,
) -> float:
    """Compute the Career Readiness Score (0-100).

    Formula:
        score = skill_match × 0.5 + time_fit × 0.25 + budget_fit × 0.25

    Where:
        • skill_match  — percentage of required skills the user has.
        • time_fit     — min(user_timeline / avg_timeline × 100, 100).
        • budget_fit   — min(user_budget / avg_training_cost × 100, 100)
                         (100 if avg_training_cost is 0).
    """
    time_fit = min((user_timeline / avg_timeline) * 100, 100) if avg_timeline > 0 else 100
    budget_fit = min((user_budget / avg_training_cost) * 100, 100) if avg_training_cost > 0 else 100

    score = (skill_match * 0.5) + (time_fit * 0.25) + (budget_fit * 0.25)
    return round(min(score, 100.0), 1)


# ────────────────────────────────────────────────────────────────────
# High-level orchestrators
# ────────────────────────────────────────────────────────────────────

async def analyse_profile(
    session: AsyncSession,
    user: UserProfile,
) -> dict[str, Any]:
    """Run the full decision-engine analysis on a user profile.

    Returns:
        dict with ``readiness_score``, ``matched_skills``, ``missing_skills``,
        ``career_path`` (the matched CareerPath row or None).
    """
    career_path = await find_best_career_path(session, user.career_goal)

    if career_path is None:
        return {
            "readiness_score": 50.0,
            "matched_skills": [],
            "missing_skills": [],
            "career_path": None,
        }

    skill_match_pct, matched, missing = compute_skill_match(
        user.skills, career_path.required_skills
    )

    score = compute_readiness_score(
        skill_match=skill_match_pct,
        user_timeline=user.timeline_months,
        avg_timeline=career_path.avg_timeline_months,
        user_budget=user.budget,
        avg_training_cost=career_path.avg_training_cost,
    )

    return {
        "readiness_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "career_path": career_path,
    }


async def analyse_skill_gap(
    session: AsyncSession,
    user_id: int,
    career_goal: str,
) -> dict[str, Any]:
    """Perform a skill-gap analysis for an existing user.

    Returns:
        dict with ``current_skills``, ``required_skills``, ``missing_skills``,
        ``readiness_score``, and the ``career_path`` model instance.

    Raises:
        ValueError: If no user with the given ID exists.
    """
    user = await session.get(UserProfile, user_id)
    if user is None:
        raise ValueError(f"User with id {user_id} not found.")

    career_path = await find_best_career_path(session, career_goal)
    required_skills: list[str] = career_path.required_skills if career_path else []

    skill_match_pct, matched, missing = compute_skill_match(
        user.skills, required_skills
    )

    avg_timeline = career_path.avg_timeline_months if career_path else 12
    avg_cost = career_path.avg_training_cost if career_path else 5000

    score = compute_readiness_score(
        skill_match=skill_match_pct,
        user_timeline=user.timeline_months,
        avg_timeline=avg_timeline,
        user_budget=user.budget,
        avg_training_cost=avg_cost,
    )

    return {
        "current_skills": user.skills,
        "required_skills": required_skills,
        "missing_skills": missing,
        "readiness_score": score,
        "career_path": career_path,
    }
