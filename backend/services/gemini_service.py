"""
Gemini AI integration service for LifeGPS AI.

Uses the ``google-genai`` SDK (``from google import genai``) to call
Gemini 2.5 Flash for career advice, roadmap generation, route planning,
future-scenario simulation, and freeform chat.

Every public method returns parsed Python objects (dicts / strings) and
handles API errors gracefully with sensible fallback responses.
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

# ── Model constant ──────────────────────────────────────────────────
MODEL_ID = "gemini-2.5-flash"

# ── System instruction shared across requests ──────────────────────
SYSTEM_INSTRUCTION = (
    "You are LifeGPS AI — an expert career advisor and life-planning assistant. "
    "You provide data-driven, actionable career guidance. You analyse a user's "
    "current skills, education, budget, and timeline to recommend the best path "
    "toward their career goal. Always be encouraging yet realistic. "
    "When asked for structured data, respond ONLY with valid JSON — no markdown "
    "fences, no commentary outside the JSON object."
)


def _get_client() -> genai.Client:
    """Return a configured ``genai.Client`` using the GEMINI_API_KEY env var.

    Raises:
        RuntimeError: If GEMINI_API_KEY is not set.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY environment variable is not set. "
            "Please add it to your .env file."
        )
    return genai.Client(api_key=api_key)


def _parse_json_response(text: str) -> Any:
    """Best-effort extraction of a JSON object from model output.

    The model is instructed to return pure JSON, but occasionally wraps
    it in markdown code fences.  This helper strips those before parsing.
    """
    cleaned = text.strip()
    if cleaned.startswith("```"):
        # Remove opening fence (```json or ```)
        first_newline = cleaned.index("\n")
        cleaned = cleaned[first_newline + 1:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


# ────────────────────────────────────────────────────────────────────
# Public API
# ────────────────────────────────────────────────────────────────────

async def generate_profile_summary(
    name: str,
    education: str,
    skills: list[str],
    career_goal: str,
    budget: float,
    timeline_months: int,
    readiness_score: float,
    skill_gap: list[str],
) -> dict[str, Any]:
    """Generate a profile summary, skill-gap list, and recommendations.

    Returns:
        dict with keys ``profile_summary``, ``skill_gap``, ``recommendations``.
    """
    prompt = (
        f"Analyse this user profile and return a JSON object with exactly three keys:\n"
        f"  • \"profile_summary\" (string) — a 2-3 sentence professional summary.\n"
        f"  • \"skill_gap\" (list[str]) — skills they still need for {career_goal}.\n"
        f"  • \"recommendations\" (list[str]) — 3-5 actionable next steps.\n\n"
        f"User details:\n"
        f"  Name: {name}\n"
        f"  Education: {education}\n"
        f"  Current skills: {', '.join(skills) if skills else 'None listed'}\n"
        f"  Career goal: {career_goal}\n"
        f"  Budget: ${budget:,.0f}\n"
        f"  Timeline: {timeline_months} months\n"
        f"  Readiness score: {readiness_score:.1f}/100\n"
        f"  Identified skill gap: {', '.join(skill_gap) if skill_gap else 'None'}\n"
    )
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        return _parse_json_response(response.text)
    except Exception as exc:
        logger.error("Gemini profile summary failed: %s", exc)
        return {
            "profile_summary": (
                f"{name} is pursuing a career as a {career_goal}. "
                f"With a background in {education} and skills in "
                f"{', '.join(skills[:3]) if skills else 'various areas'}, "
                f"they have a readiness score of {readiness_score:.0f}/100."
            ),
            "skill_gap": skill_gap,
            "recommendations": [
                f"Focus on acquiring the top missing skills for {career_goal}.",
                "Build portfolio projects to demonstrate your abilities.",
                "Consider online courses within your budget.",
                "Network with professionals in your target field.",
            ],
        }


async def generate_skill_gap_analysis(
    current_skills: list[str],
    career_goal: str,
    required_skills: list[str],
    missing_skills: list[str],
    readiness_score: float,
) -> dict[str, Any]:
    """Return AI-enhanced recommendations for closing the skill gap.

    Returns:
        dict with key ``recommendations`` (list[str]).
    """
    prompt = (
        f"A user wants to become a {career_goal}.\n"
        f"Current skills: {', '.join(current_skills) if current_skills else 'None'}.\n"
        f"Required skills: {', '.join(required_skills)}.\n"
        f"Missing skills: {', '.join(missing_skills) if missing_skills else 'None'}.\n"
        f"Readiness score: {readiness_score:.1f}/100.\n\n"
        f"Return a JSON object with one key:\n"
        f"  • \"recommendations\" (list[str]) — 4-6 specific, prioritised steps "
        f"the user should take to close their skill gap.\n"
    )
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        return _parse_json_response(response.text)
    except Exception as exc:
        logger.error("Gemini skill-gap analysis failed: %s", exc)
        return {
            "recommendations": [
                f"Start learning {missing_skills[0]} — it is the most critical gap."
                if missing_skills else "Review the required skills list.",
                "Take an online course on a reputable platform like Coursera or Udemy.",
                "Build hands-on projects to reinforce new skills.",
                "Seek mentorship from professionals in the field.",
            ]
        }


async def generate_career_routes(
    career_goal: str,
    current_skills: list[str],
    budget: float,
    timeline_months: int,
) -> dict[str, Any]:
    """Generate 3 distinct learning routes toward the career goal.

    Returns:
        dict with key ``routes`` — a list of route objects.
    """
    prompt = (
        f"Create exactly 3 different learning routes for someone who wants to become a "
        f"{career_goal}.\n\n"
        f"Current skills: {', '.join(current_skills) if current_skills else 'None'}.\n"
        f"Budget: ${budget:,.0f}.\n"
        f"Timeline: {timeline_months} months.\n\n"
        f"Return a JSON object with one key \"routes\" containing a list of 3 objects. "
        f"Each object must have:\n"
        f"  • \"name\" (str) — route name (e.g. \"Self-Taught Path\")\n"
        f"  • \"type\" (str) — one of \"self-paced\", \"bootcamp\", \"university\"\n"
        f"  • \"steps\" (list of objects) — each with keys \"step\", \"resource\", \"duration\", \"cost\"\n"
        f"  • \"total_cost\" (str) — e.g. \"$2,500\"\n"
        f"  • \"total_duration\" (str) — e.g. \"8 months\"\n"
        f"  • \"difficulty\" (str) — Beginner / Intermediate / Advanced\n"
        f"  • \"success_score\" (float) — estimated probability of landing the job (0-100)\n"
    )
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.8,
                max_output_tokens=2048,
            ),
        )
        return _parse_json_response(response.text)
    except Exception as exc:
        logger.error("Gemini route generation failed: %s", exc)
        return {
            "routes": [
                {
                    "name": "Self-Taught Path",
                    "type": "self-paced",
                    "steps": [
                        {"step": "Learn fundamentals", "resource": "freeCodeCamp / YouTube", "duration": "2 months", "cost": "Free"},
                        {"step": "Build projects", "resource": "Personal projects", "duration": "3 months", "cost": "Free"},
                        {"step": "Get certified", "resource": "Online certification", "duration": "1 month", "cost": "$200"},
                    ],
                    "total_cost": "$200",
                    "total_duration": "6 months",
                    "difficulty": "Intermediate",
                    "success_score": 60.0,
                },
                {
                    "name": "Bootcamp Path",
                    "type": "bootcamp",
                    "steps": [
                        {"step": "Enroll in bootcamp", "resource": "Coding Bootcamp", "duration": "3 months", "cost": "$5,000"},
                        {"step": "Capstone project", "resource": "Bootcamp project", "duration": "1 month", "cost": "Included"},
                        {"step": "Job placement support", "resource": "Career services", "duration": "2 months", "cost": "Included"},
                    ],
                    "total_cost": "$5,000",
                    "total_duration": "6 months",
                    "difficulty": "Intermediate",
                    "success_score": 75.0,
                },
                {
                    "name": "Degree Path",
                    "type": "university",
                    "steps": [
                        {"step": "Enroll in degree program", "resource": "University", "duration": "24 months", "cost": "$20,000"},
                        {"step": "Internship", "resource": "Industry placement", "duration": "6 months", "cost": "Paid"},
                    ],
                    "total_cost": "$20,000",
                    "total_duration": "30 months",
                    "difficulty": "Advanced",
                    "success_score": 85.0,
                },
            ]
        }


async def generate_roadmap(
    career_goal: str,
    current_skills: list[str],
    timeline_months: int,
    missing_skills: list[str],
) -> dict[str, Any]:
    """Generate a month-by-month learning roadmap.

    Returns:
        dict with key ``roadmap`` — list of monthly plan objects.
    """
    prompt = (
        f"Create a detailed month-by-month learning roadmap for someone who wants to "
        f"become a {career_goal} in {timeline_months} months.\n\n"
        f"Current skills: {', '.join(current_skills) if current_skills else 'None'}.\n"
        f"Skills to learn: {', '.join(missing_skills) if missing_skills else 'Review and deepen existing skills'}.\n\n"
        f"Return a JSON object with one key \"roadmap\" containing a list of objects, "
        f"one per month (or grouped logically if > 12 months). Each object must have:\n"
        f"  • \"month\" (int)\n"
        f"  • \"title\" (str) — theme for the month\n"
        f"  • \"tasks\" (list[str]) — 3-5 concrete tasks\n"
        f"  • \"resources\" (list[str]) — specific courses, books, or tools\n"
        f"  • \"milestone\" (str) — what success looks like at end of month\n"
    )
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=4096,
            ),
        )
        return _parse_json_response(response.text)
    except Exception as exc:
        logger.error("Gemini roadmap generation failed: %s", exc)
        # Build a minimal fallback roadmap
        roadmap = []
        for m in range(1, min(timeline_months + 1, 7)):
            roadmap.append({
                "month": m,
                "title": f"Month {m}: Foundation building" if m <= 2 else f"Month {m}: Skill development",
                "tasks": [
                    "Study core concepts",
                    "Complete practice exercises",
                    "Work on a mini-project",
                ],
                "resources": ["Coursera", "YouTube tutorials", "Official documentation"],
                "milestone": f"Complete month {m} objectives",
            })
        return {"roadmap": roadmap}


async def generate_future_simulation(
    career_goal: str,
    current_skills: list[str],
    timeline_months: int,
    education: str,
    readiness_score: float,
) -> dict[str, Any]:
    """Simulate best-case, expected, and worst-case career outcomes.

    Returns:
        dict with key ``scenarios`` containing three scenario objects.
    """
    prompt = (
        f"Simulate three future career scenarios for a user who aims to become a "
        f"{career_goal} within {timeline_months} months.\n\n"
        f"Background: {education}.\n"
        f"Current skills: {', '.join(current_skills) if current_skills else 'None'}.\n"
        f"Readiness score: {readiness_score:.1f}/100.\n\n"
        f"Return a JSON object with one key \"scenarios\" whose value is an object "
        f"with exactly three keys: \"best_case\", \"expected\", \"worst_case\".\n"
        f"Each scenario must have:\n"
        f"  • \"job_title\" (str)\n"
        f"  • \"salary_range\" (str) — e.g. \"$90,000 - $120,000\"\n"
        f"  • \"certifications\" (list[str])\n"
        f"  • \"skills_acquired\" (list[str])\n"
        f"  • \"description\" (str) — 2-3 sentence narrative\n"
    )
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.8,
                max_output_tokens=2048,
            ),
        )
        return _parse_json_response(response.text)
    except Exception as exc:
        logger.error("Gemini simulation failed: %s", exc)
        base_scenario = {
            "job_title": career_goal,
            "salary_range": "$70,000 - $90,000",
            "certifications": ["Relevant industry certification"],
            "skills_acquired": current_skills[:5] if current_skills else ["Core skills"],
            "description": f"After {timeline_months} months of dedicated effort, the user transitions into a {career_goal} role.",
        }
        return {
            "scenarios": {
                "best_case": {**base_scenario, "salary_range": "$100,000 - $140,000", "description": f"Exceptional progress — lands a senior-level {career_goal} role ahead of schedule."},
                "expected": base_scenario,
                "worst_case": {**base_scenario, "salary_range": "$50,000 - $70,000", "description": f"Slower progress due to external factors, secures a junior {career_goal} position."},
            }
        }


async def generate_chat_response(
    user_message: str,
    history: list[dict[str, str]],
    user_context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Handle a freeform chat message with conversation context.

    Args:
        user_message: The latest message from the user.
        history: Previous messages as ``[{"role": ..., "content": ...}, ...]``.
        user_context: Optional dict with user profile data for richer replies.

    Returns:
        dict with ``response`` (str) and ``suggestions`` (list[str]).
    """
    # Build contents list for multi-turn conversation
    contents: list[types.Content] = []
    for msg in history:
        contents.append(
            types.Content(
                role="user" if msg["role"] == "user" else "model",
                parts=[types.Part.from_text(text=msg["content"])],
            )
        )
    # Append the current user message
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_message)],
        )
    )

    context_str = ""
    if user_context:
        context_str = (
            f"\n\nUser context — Name: {user_context.get('name', 'N/A')}, "
            f"Career goal: {user_context.get('career_goal', 'N/A')}, "
            f"Skills: {', '.join(user_context.get('skills', []))}, "
            f"Education: {user_context.get('education', 'N/A')}."
        )

    chat_system = (
        SYSTEM_INSTRUCTION
        + context_str
        + "\n\nAfter your main response, add a line break and then provide "
        "a JSON object on a new line with exactly one key: "
        "\"suggestions\" (list of 3 short follow-up questions the user might ask)."
    )

    try:
        client = _get_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=chat_system,
                temperature=0.8,
                max_output_tokens=1024,
            ),
        )
        text = response.text.strip()

        # Try to separate main reply from suggestions JSON
        suggestions: list[str] = []
        main_response = text
        # Look for the JSON block at the end
        last_brace = text.rfind("}")
        first_brace_of_json = text.rfind('{"suggestions"')
        if first_brace_of_json == -1:
            first_brace_of_json = text.rfind('{ "suggestions"')

        if first_brace_of_json != -1 and last_brace != -1:
            json_part = text[first_brace_of_json:last_brace + 1]
            main_response = text[:first_brace_of_json].strip()
            try:
                parsed = json.loads(json_part)
                suggestions = parsed.get("suggestions", [])
            except json.JSONDecodeError:
                pass

        if not suggestions:
            suggestions = [
                "What skills should I learn first?",
                "Can you recommend resources?",
                "How long will this take?",
            ]

        return {"response": main_response, "suggestions": suggestions}
    except Exception as exc:
        logger.error("Gemini chat failed: %s", exc)
        return {
            "response": (
                "I'm having trouble connecting to my AI engine right now. "
                "Please try again in a moment. In the meantime, feel free to "
                "explore the skill-gap analysis or roadmap features!"
            ),
            "suggestions": [
                "Tell me about skill-gap analysis",
                "How does the roadmap work?",
                "What career paths are available?",
            ],
        }
