"""
Pydantic V2 request / response schemas for every LifeGPS AI endpoint.

Each pair follows the naming convention ``<Feature>Request`` / ``<Feature>Response``.
All models use ``model_config = ConfigDict(from_attributes=True)`` so they
can be constructed directly from SQLAlchemy rows when needed.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ────────────────────────────────────────────────────────────────────
# POST /api/profile
# ────────────────────────────────────────────────────────────────────

class ProfileRequest(BaseModel):
    """Payload sent by the frontend when creating / updating a user profile."""
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=3, max_length=255)
    education: str = Field(..., min_length=1, max_length=500)
    skills: list[str] = Field(default_factory=list)
    career_goal: str = Field(..., min_length=1, max_length=500)
    budget: float = Field(..., ge=0)
    timeline_months: int = Field(..., ge=1, le=120)


class ProfileResponse(BaseModel):
    """Returned after a profile is created / updated."""
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    readiness_score: float
    profile_summary: str
    skill_gap: list[str]
    recommendations: list[str]


# ────────────────────────────────────────────────────────────────────
# POST /api/skill-gap
# ────────────────────────────────────────────────────────────────────

class SkillGapRequest(BaseModel):
    user_id: int
    career_goal: str = Field(..., min_length=1)


class SkillGapResponse(BaseModel):
    career_goal: str
    current_skills: list[str]
    required_skills: list[str]
    missing_skills: list[str]
    readiness_score: float
    recommendations: list[str]


# ────────────────────────────────────────────────────────────────────
# POST /api/routes
# ────────────────────────────────────────────────────────────────────

class RouteStep(BaseModel):
    step: str
    resource: str
    duration: str
    cost: str


class Route(BaseModel):
    name: str
    type: str
    steps: list[RouteStep]
    total_cost: str
    total_duration: str
    difficulty: str
    success_score: float


class RoutesRequest(BaseModel):
    user_id: int
    career_goal: str = Field(..., min_length=1)


class RoutesResponse(BaseModel):
    routes: list[Route]


# ────────────────────────────────────────────────────────────────────
# POST /api/roadmap
# ────────────────────────────────────────────────────────────────────

class RoadmapMonth(BaseModel):
    month: int
    title: str
    tasks: list[str]
    resources: list[str]
    milestone: str


class RoadmapRequest(BaseModel):
    user_id: int
    career_goal: str = Field(..., min_length=1)
    timeline_months: int = Field(..., ge=1, le=120)


class RoadmapResponse(BaseModel):
    career_goal: str
    timeline_months: int
    roadmap: list[RoadmapMonth]


# ────────────────────────────────────────────────────────────────────
# POST /api/future-simulation
# ────────────────────────────────────────────────────────────────────

class Scenario(BaseModel):
    job_title: str
    salary_range: str
    certifications: list[str]
    skills_acquired: list[str]
    description: str


class SimulationScenarios(BaseModel):
    best_case: Scenario
    expected: Scenario
    worst_case: Scenario


class FutureSimulationRequest(BaseModel):
    user_id: int
    career_goal: str = Field(..., min_length=1)
    timeline_months: int = Field(..., ge=1, le=120)


class FutureSimulationResponse(BaseModel):
    career_goal: str
    timeline_months: int
    scenarios: SimulationScenarios


# ────────────────────────────────────────────────────────────────────
# POST /api/chat
# ────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str = Field(..., pattern=r"^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    user_id: int
    message: str = Field(..., min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str
    suggestions: list[str]
