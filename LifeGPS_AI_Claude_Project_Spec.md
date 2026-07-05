# LifeGPS AI - Complete Project Specification for Claude

## Role
Act as a Senior Staff Software Engineer, AI Architect, Product Manager, and UI/UX Designer.

Build a production-ready Final Year Project named:

**LifeGPS AI: An AI-Powered Career Planning and Skill Development Platform**

---

# Project Goal

Develop a web-based AI platform that helps students and professionals:

- Analyze current skills
- Identify skill gaps
- Generate career pathways
- Create learning roadmaps
- Simulate future career outcomes
- Receive AI-powered career guidance

---

# MVP Features

## 1. User Profile Assessment

Input:
- Name
- Education
- Current Skills
- Career Goal
- Budget
- Timeline

Output:
- Career Readiness Score
- Profile Summary

---

## 2. Skill Gap Analyzer

Compare user skills against required career skills.

Output:
- Missing Skills
- Readiness Score

---

## 3. Career Route Generator

Generate:

### Route A
Fast Track

### Route B
Budget Friendly

### Route C
Advanced Route

Each route must contain:
- Learning Steps
- Cost
- Duration
- Difficulty
- Success Score

---

## 4. Learning Roadmap

Generate monthly roadmap.

Example:

Month 1:
Linux

Month 2:
AWS CCP

Month 3:
Networking

Month 4:
Projects

---

## 5. Future Self Simulator

Predict:

- Certifications Completed
- Skills Acquired
- Job Role
- Salary Range

after the selected timeline.

---

## 6. AI Career Advisor

Chat interface using Gemini.

Questions:
- AWS vs Azure
- What should I learn next?
- Which certification is best?

---

# Technology Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

Backend:
- FastAPI
- Python

Database:
- PostgreSQL

AI:
- Gemini API

Deployment:
- Vercel
- Render

---

# Folder Structure

lifegps-ai/

frontend/
backend/
database/
docs/

frontend/
app/
components/
services/
hooks/

backend/
api/
models/
services/
decision_engine/
simulation_engine/

database/
schema.sql
seed_data/

docs/
architecture/
report/

---

# Database Schema

Users:
- id
- name
- email
- education

Skills:
- id
- user_id
- skill_name

Goals:
- id
- user_id
- goal
- budget
- timeline

CareerPaths:
- id
- career_name
- required_skills
- salary_range

---

# Careers for MVP

- Cloud Engineer
- Software Engineer
- AI Engineer
- Data Analyst
- Cybersecurity Analyst
- DevOps Engineer

---

# API Endpoints

POST /api/profile
POST /api/skill-gap
POST /api/routes
POST /api/future-simulation
POST /api/chat

---

# UI Pages

1. Landing Page
2. Career Assessment Form
3. Dashboard
4. Career Routes
5. Learning Roadmap
6. Future Self Simulator
7. AI Career Advisor

---

# Dashboard Widgets

- Career Readiness Score
- Missing Skills
- Success Probability
- Salary Estimate
- Recommended Route

---

# Career Readiness Formula

Readiness Score =
(skill_match * 0.5) +
(time_fit * 0.25) +
(budget_fit * 0.25)

Return score out of 100.

---

# Future Self Simulator Prompt

Given:
- Current Skills
- Career Goal
- Budget
- Timeline

Predict:
- Best Case Scenario
- Expected Scenario
- Worst Case Scenario

---

# Deliverables

Generate:

1. Complete architecture
2. Database schema
3. Backend code
4. Frontend code
5. API integrations
6. Gemini integration
7. UI design
8. Deployment guide
9. Testing guide
10. README

Build the project module-by-module and provide production-ready code.
