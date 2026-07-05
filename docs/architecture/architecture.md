# LifeGPS AI — System Architecture

## Overview

LifeGPS AI is a full-stack AI-powered career planning platform that helps students and professionals navigate their career journey. The system uses Google's Gemini AI to provide intelligent career guidance, skill gap analysis, and personalized learning roadmaps.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (TypeScript)                │  │
│  │                                                           │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌─────────────┐ │  │
│  │  │Landing  │ │Assessment│ │ Dashboard │ │Career Routes│ │  │
│  │  │Page     │ │Form      │ │           │ │             │ │  │
│  │  └─────────┘ └──────────┘ └───────────┘ └─────────────┘ │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐                 │  │
│  │  │Learning │ │Future    │ │AI Career  │                  │  │
│  │  │Roadmap  │ │Simulator │ │Advisor    │                  │  │
│  │  └─────────┘ └──────────┘ └───────────┘                 │  │
│  │                     │                                     │  │
│  │              API Service Layer                            │  │
│  └──────────────────────┼────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │ REST API (JSON)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Python)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     API Router                            │   │
│  │  POST /api/profile    POST /api/skill-gap                │   │
│  │  POST /api/routes     POST /api/roadmap                  │   │
│  │  POST /api/future-simulation    POST /api/chat           │   │
│  └──────────────┬───────────────────────┬───────────────────┘   │
│                 │                       │                        │
│  ┌──────────────▼──────────┐ ┌─────────▼───────────────────┐   │
│  │    Decision Engine      │ │    Simulation Engine         │   │
│  │                         │ │                              │   │
│  │  • Readiness Score      │ │  • Best Case Prediction     │   │
│  │  • Skill Gap Analysis   │ │  • Expected Prediction      │   │
│  │  • Route Generation     │ │  • Worst Case Prediction    │   │
│  └──────────┬──────────────┘ └──────────┬──────────────────┘   │
│             │                           │                       │
│  ┌──────────▼───────────────────────────▼──────────────────┐   │
│  │              Gemini AI Service                           │   │
│  │                                                          │   │
│  │  • Career Analysis    • Route Planning                   │   │
│  │  • Roadmap Generation • Future Simulation                │   │
│  │  • Chat Advisor       • Structured JSON Output           │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │              Database Layer (SQLAlchemy)                  │   │
│  │                                                          │   │
│  │  Users │ Skills │ Goals │ CareerPaths │ Assessments      │   │
│  │                   │ ChatHistory                           │   │
│  └──────────────────────────┬──────────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  SQLite / PostgreSQL│
                    │     Database        │
                    └─────────────────────┘

External:
┌──────────────────────┐
│  Google Gemini API   │
│  (gemini-2.5-flash)  │
└──────────────────────┘
```

## Component Details

### Frontend (Next.js)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context (client-side)
- **Animations**: Framer Motion + CSS animations
- **Design**: Dark mode, glassmorphism, gradient accents

### Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy 2.0+ (async)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI**: Google Gemini API via `google-genai` SDK
- **Validation**: Pydantic V2

### Decision Engine
Calculates career readiness using the formula:
```
Readiness Score = (skill_match × 0.5) + (time_fit × 0.25) + (budget_fit × 0.25)
```
- **skill_match**: Percentage of required skills the user already has
- **time_fit**: How well the user's timeline fits the career's average timeline
- **budget_fit**: Whether the user's budget covers estimated training costs

### Simulation Engine
Uses Gemini AI to predict future career outcomes in three scenarios:
- **Best Case**: Maximum potential with full effort and luck
- **Expected**: Realistic outcome with consistent effort
- **Worst Case**: Minimum expected progress

### Data Flow
1. User fills assessment form → Frontend POSTs to `/api/profile`
2. Backend creates user, calculates readiness score, queries Gemini for analysis
3. Dashboard displays results from stored assessment
4. User explores routes/roadmap/simulator → Each triggers Gemini-powered analysis
5. AI Advisor provides real-time chat with context-aware career guidance

## Database Schema

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | User profiles | One-to-many: skills, goals, assessments, chat |
| `skills` | User's current skills | Belongs to user |
| `goals` | Career goals with budget/timeline | Belongs to user |
| `career_paths` | Reference data for 6 careers | Standalone reference |
| `user_assessments` | Generated assessment results | Belongs to user |
| `chat_history` | AI advisor conversation logs | Belongs to user |

## Security Considerations (MVP)
- No authentication in MVP (session-based user tracking)
- CORS restricted to frontend origin
- API key stored in environment variables
- Input validation via Pydantic schemas
- SQL injection prevention via SQLAlchemy ORM
