# LifeGPS AI — Testing Guide

## Overview

This guide covers testing strategies for both the backend (FastAPI) and frontend (Next.js) components of LifeGPS AI.

---

## Backend Testing

### Setup

```bash
cd backend
source venv/bin/activate
pip install pytest pytest-asyncio httpx
```

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=. --cov-report=html
```

### Test Categories

#### 1. API Endpoint Tests

Test each endpoint with valid and invalid inputs:

```python
# tests/test_api.py
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_create_profile():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        response = await client.post("/api/profile", json={
            "name": "Test User",
            "email": "test@example.com",
            "education": "B.Tech Computer Science",
            "skills": ["Python", "SQL", "Git"],
            "career_goal": "Software Engineer",
            "budget": 500,
            "timeline_months": 6
        })
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "readiness_score" in data
        assert 0 <= data["readiness_score"] <= 100

@pytest.mark.asyncio
async def test_skill_gap():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        response = await client.post("/api/skill-gap", json={
            "user_id": 1,
            "career_goal": "Cloud Engineer"
        })
        assert response.status_code == 200
        data = response.json()
        assert "missing_skills" in data
        assert "readiness_score" in data
```

#### 2. Decision Engine Tests

```python
# tests/test_decision_engine.py
from decision_engine.career_engine import calculate_readiness_score

def test_readiness_score_full_match():
    score = calculate_readiness_score(
        matched_skills=10,
        total_required=10,
        user_timeline=6,
        avg_timeline=6,
        user_budget=1000,
        avg_cost=500
    )
    assert score == 100.0

def test_readiness_score_no_skills():
    score = calculate_readiness_score(
        matched_skills=0,
        total_required=10,
        user_timeline=6,
        avg_timeline=6,
        user_budget=1000,
        avg_cost=500
    )
    assert score == 50.0  # time_fit + budget_fit only
```

#### 3. Manual API Testing with Swagger

1. Start the backend: `uvicorn main:app --reload`
2. Open `http://localhost:8000/docs`
3. Test each endpoint using the interactive Swagger UI
4. Verify response schemas match expected formats

---

## Frontend Testing

### Build Verification

The simplest way to verify the frontend:

```bash
cd frontend
npm run build
```

A successful build confirms:
- All TypeScript types are correct
- All imports resolve
- No compilation errors
- Pages render without errors

### Manual Testing Checklist

#### Landing Page (`/`)
- [ ] Hero section renders with gradient animation
- [ ] All 6 feature cards are visible
- [ ] CTA button navigates to `/assessment`
- [ ] Page is responsive on mobile

#### Assessment Form (`/assessment`)
- [ ] 3-step form navigation works
- [ ] Skills can be selected/deselected
- [ ] Career goal dropdown shows all 6 options
- [ ] Form validation prevents empty submissions
- [ ] Submit creates profile and redirects to dashboard

#### Dashboard (`/dashboard`)
- [ ] Readiness score gauge animates
- [ ] All 5 widgets display data
- [ ] Navigation to other pages works
- [ ] Loading states show correctly

#### Career Routes (`/routes`)
- [ ] 3 route cards display correctly
- [ ] Each shows steps, cost, duration, difficulty, score
- [ ] Cards have hover effects

#### Learning Roadmap (`/roadmap`)
- [ ] Timeline renders with monthly entries
- [ ] Each month shows tasks and resources
- [ ] Milestones are highlighted

#### Future Simulator (`/simulator`)
- [ ] 3 scenario cards (Best/Expected/Worst) render
- [ ] Each shows job title, salary, certifications, skills
- [ ] Animations work on load

#### AI Advisor (`/advisor`)
- [ ] Chat input works
- [ ] Messages display correctly (user right, AI left)
- [ ] Suggested questions are clickable
- [ ] Typing indicator shows during API call

---

## End-to-End Flow Test

1. Open `http://localhost:3000`
2. Click "Start Your Career Journey"
3. Fill in assessment: Name, Education, select skills, choose "Cloud Engineer"
4. Submit → verify redirect to Dashboard
5. Check readiness score is calculated
6. Navigate to Career Routes → verify 3 routes generated
7. Navigate to Learning Roadmap → verify monthly plan
8. Navigate to Future Simulator → verify 3 scenarios
9. Navigate to AI Advisor → send "What certifications should I get?" → verify response

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| API returns 422 | Invalid request body | Check Pydantic schema matches frontend payload |
| CORS error | Frontend origin not allowed | Add origin to FastAPI CORS config |
| Gemini timeout | API rate limit or slow response | Add retry logic, increase timeout |
| Dashboard empty | No assessment data | Complete assessment first |
| Chat not responding | Missing GEMINI_API_KEY | Set the key in `.env` |
