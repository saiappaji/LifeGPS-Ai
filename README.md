# 🧭 LifeGPS AI

**An AI-Powered Career Planning and Skill Development Platform**

LifeGPS AI helps students and professionals navigate their career journey with artificial intelligence. Analyze your skills, identify gaps, explore career pathways, and get personalized guidance — all powered by Google Gemini AI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 **Career Assessment** | Multi-step profile assessment with AI-powered readiness scoring |
| 🔍 **Skill Gap Analyzer** | Compare your skills against career requirements |
| 🛤️ **Career Route Generator** | 3 personalized career routes: Fast Track, Budget Friendly, Advanced |
| 📅 **Learning Roadmap** | Month-by-month learning plan with milestones |
| 🔮 **Future Self Simulator** | AI-predicted career outcomes (Best/Expected/Worst case) |
| 💬 **AI Career Advisor** | Real-time chat with an AI career counselor |

## 🎯 Supported Careers (MVP)

- ☁️ Cloud Engineer
- 💻 Software Engineer
- 🤖 AI Engineer
- 📊 Data Analyst
- 🔒 Cybersecurity Analyst
- ⚙️ DevOps Engineer

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | FastAPI, Python, SQLAlchemy |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **AI** | Google Gemini API (gemini-2.5-flash) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
lifegps-ai/
├── frontend/                # Next.js application
│   └── src/
│       ├── app/             # Pages (App Router)
│       ├── components/      # Reusable UI components
│       ├── lib/             # API client, utilities
│       ├── hooks/           # React hooks
│       └── types/           # TypeScript interfaces
├── backend/                 # FastAPI application
│   ├── api/                 # Routes and schemas
│   ├── models/              # Database models
│   ├── services/            # Gemini AI service
│   ├── decision_engine/     # Career readiness logic
│   └── simulation_engine/   # Future prediction engine
├── database/                # SQL schema and seed data
│   ├── schema.sql
│   └── seed_data/
└── docs/                    # Documentation
    ├── architecture/
    └── report/
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lifegps-ai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive Swagger UI.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./lifegps.db
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile` | Create user profile and get initial assessment |
| POST | `/api/skill-gap` | Analyze skill gaps for a career goal |
| POST | `/api/routes` | Generate 3 career route options |
| POST | `/api/roadmap` | Generate monthly learning roadmap |
| POST | `/api/future-simulation` | Predict future career outcomes |
| POST | `/api/chat` | AI career advisor chat |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest tests/ -v
```

### Frontend Build Check

```bash
cd frontend
npm run build
```

---

## 🚢 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
5. Deploy

### Backend → Render

1. Push to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `GEMINI_API_KEY`, `DATABASE_URL`
7. Deploy

---

## 📊 Career Readiness Formula

```
Readiness Score = (skill_match × 0.5) + (time_fit × 0.25) + (budget_fit × 0.25)
```

Returns a score from 0 to 100 representing how prepared the user is for their target career.

---

## 📄 License

This project is built as a Final Year Project for academic purposes.

---

## 👤 Author

Built with ❤️ using LifeGPS AI
