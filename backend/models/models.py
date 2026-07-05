"""
SQLAlchemy ORM models for LifeGPS AI.

Defines the database schema for user profiles, career paths,
and conversation history.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class UserProfile(Base):
    """Stores user profile information and career preferences.

    Attributes:
        id: Auto-incremented primary key.
        name: User's full name.
        email: User's email address (unique).
        education: Highest education level or current program.
        skills: JSON list of the user's current skills.
        career_goal: The user's stated career objective.
        budget: Budget available for training/upskilling (USD).
        timeline_months: Desired timeline to reach career goal.
        readiness_score: Computed career-readiness score (0-100).
        profile_summary: AI-generated summary of the profile.
        created_at: Timestamp when the profile was created.
        updated_at: Timestamp of the last profile update.
    """

    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    education: Mapped[str] = mapped_column(String(500), nullable=False)
    skills: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    career_goal: Mapped[str] = mapped_column(String(500), nullable=False)
    budget: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    timeline_months: Mapped[int] = mapped_column(Integer, nullable=False, default=12)
    readiness_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    profile_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )


class CareerPath(Base):
    """Reference table of known career paths with skill and cost metadata.

    Seeded on startup to provide the decision engine with baseline data
    for readiness scoring, skill-gap analysis, and route generation.

    Attributes:
        id: Auto-incremented primary key.
        title: Career/role title (e.g., "Full-Stack Developer").
        required_skills: JSON list of skills needed for this career.
        avg_salary: Average annual salary in USD.
        avg_training_cost: Typical cost to acquire the required skills.
        avg_timeline_months: Average months needed to become job-ready.
        difficulty: Qualitative difficulty level (Beginner/Intermediate/Advanced).
        description: Short description of the career path.
    """

    __tablename__ = "career_paths"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    required_skills: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    avg_salary: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    avg_training_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    avg_timeline_months: Mapped[int] = mapped_column(Integer, nullable=False, default=12)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False, default="Intermediate")
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class ChatHistory(Base):
    """Persists individual chat messages for a user session.

    Attributes:
        id: Auto-incremented primary key.
        user_id: Foreign-key-like reference to user_profiles.id.
        role: Message role — "user" or "assistant".
        content: The message text.
        created_at: Timestamp of the message.
    """

    __tablename__ = "chat_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )


# ---------------------------------------------------------------------------
# Seed data — inserted on first startup when career_paths is empty
# ---------------------------------------------------------------------------

SEED_CAREER_PATHS: list[dict] = [
    {
        "title": "Full-Stack Developer",
        "required_skills": [
            "JavaScript", "TypeScript", "React", "Node.js", "Python",
            "SQL", "Git", "REST APIs", "HTML", "CSS",
        ],
        "avg_salary": 110000,
        "avg_training_cost": 5000,
        "avg_timeline_months": 12,
        "difficulty": "Intermediate",
        "description": "Build complete web applications from front-end UI to back-end APIs and databases.",
    },
    {
        "title": "Data Scientist",
        "required_skills": [
            "Python", "Machine Learning", "Statistics", "SQL",
            "Pandas", "NumPy", "Data Visualization", "Deep Learning",
            "TensorFlow", "Scikit-learn",
        ],
        "avg_salary": 120000,
        "avg_training_cost": 8000,
        "avg_timeline_months": 18,
        "difficulty": "Advanced",
        "description": "Extract insights from data using statistical methods, machine learning, and visualization.",
    },
    {
        "title": "Cloud Engineer",
        "required_skills": [
            "AWS", "Azure", "Docker", "Kubernetes", "Linux",
            "Terraform", "CI/CD", "Networking", "Python", "Security",
        ],
        "avg_salary": 130000,
        "avg_training_cost": 6000,
        "avg_timeline_months": 12,
        "difficulty": "Advanced",
        "description": "Design, deploy, and manage scalable cloud infrastructure and services.",
    },
    {
        "title": "UX Designer",
        "required_skills": [
            "Figma", "User Research", "Wireframing", "Prototyping",
            "Usability Testing", "Information Architecture", "Visual Design",
            "Design Systems", "HTML", "CSS",
        ],
        "avg_salary": 95000,
        "avg_training_cost": 4000,
        "avg_timeline_months": 9,
        "difficulty": "Intermediate",
        "description": "Create intuitive, user-centered digital experiences through research and design.",
    },
    {
        "title": "Cybersecurity Analyst",
        "required_skills": [
            "Network Security", "Linux", "SIEM", "Incident Response",
            "Firewalls", "Penetration Testing", "Python", "Compliance",
            "Cryptography", "Risk Assessment",
        ],
        "avg_salary": 105000,
        "avg_training_cost": 7000,
        "avg_timeline_months": 15,
        "difficulty": "Advanced",
        "description": "Protect organizations from cyber threats through monitoring, analysis, and incident response.",
    },
    {
        "title": "Mobile App Developer",
        "required_skills": [
            "React Native", "Swift", "Kotlin", "JavaScript",
            "REST APIs", "Git", "UI/UX", "Firebase",
            "App Store Deployment", "Testing",
        ],
        "avg_salary": 105000,
        "avg_training_cost": 4500,
        "avg_timeline_months": 10,
        "difficulty": "Intermediate",
        "description": "Build native and cross-platform mobile applications for iOS and Android.",
    },
    {
        "title": "DevOps Engineer",
        "required_skills": [
            "Docker", "Kubernetes", "CI/CD", "Linux", "AWS",
            "Terraform", "Ansible", "Monitoring", "Python", "Git",
        ],
        "avg_salary": 125000,
        "avg_training_cost": 5500,
        "avg_timeline_months": 12,
        "difficulty": "Advanced",
        "description": "Bridge development and operations with automation, CI/CD pipelines, and infrastructure as code.",
    },
    {
        "title": "AI/ML Engineer",
        "required_skills": [
            "Python", "TensorFlow", "PyTorch", "Machine Learning",
            "Deep Learning", "NLP", "Computer Vision", "MLOps",
            "Docker", "Mathematics",
        ],
        "avg_salary": 140000,
        "avg_training_cost": 10000,
        "avg_timeline_months": 18,
        "difficulty": "Advanced",
        "description": "Design, build, and deploy machine learning models and AI-powered systems at scale.",
    },
    {
        "title": "Product Manager",
        "required_skills": [
            "Product Strategy", "Agile", "User Research", "Data Analysis",
            "Roadmapping", "Stakeholder Management", "A/B Testing",
            "SQL", "Communication", "Market Analysis",
        ],
        "avg_salary": 130000,
        "avg_training_cost": 5000,
        "avg_timeline_months": 12,
        "difficulty": "Intermediate",
        "description": "Define product vision, strategy, and roadmap while coordinating cross-functional teams.",
    },
    {
        "title": "Backend Developer",
        "required_skills": [
            "Python", "Java", "SQL", "REST APIs", "Microservices",
            "Docker", "Git", "Testing", "System Design", "Linux",
        ],
        "avg_salary": 115000,
        "avg_training_cost": 4500,
        "avg_timeline_months": 10,
        "difficulty": "Intermediate",
        "description": "Build server-side logic, APIs, and database systems that power applications.",
    },
]
