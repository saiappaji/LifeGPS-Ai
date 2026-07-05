// =============================================
// LifeGPS AI - TypeScript Type Definitions
// =============================================

// --- User & Profile ---
export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  education: string;
  skills: string[];
  career_goal: string;
  budget: number;
  timeline_months: number;
  readiness_score: number;
  profile_summary: string;
  skill_gap: string[];
  recommendations: string[];
}

export interface ProfileRequest {
  name: string;
  email: string;
  education: string;
  skills: string[];
  career_goal: string;
  budget: number;
  timeline_months: number;
}

export interface ProfileResponse {
  user_id: string;
  readiness_score: number;
  profile_summary: string;
  skill_gap: string[];
  recommendations: string[];
}

// --- Skill Gap Analysis ---
export interface SkillGapRequest {
  user_id: string;
  career_goal: string;
}

export interface SkillGapResponse {
  career_goal: string;
  current_skills: string[];
  required_skills: string[];
  missing_skills: string[];
  readiness_score: number;
  recommendations: string[];
}

// --- Career Routes ---
export interface RouteStep {
  step: string;
  resource: string;
  duration: string;
  cost: string;
}

export interface CareerRoute {
  name: string;
  type: string;
  steps: RouteStep[];
  total_cost: string;
  total_duration: string;
  difficulty: string;
  success_score: number;
}

export interface RoutesRequest {
  user_id: string;
  career_goal: string;
}

export interface RoutesResponse {
  routes: CareerRoute[];
}

// --- Learning Roadmap ---
export interface RoadmapMonth {
  month: number;
  title: string;
  tasks: string[];
  resources: string[];
  milestone: string;
}

export interface RoadmapRequest {
  user_id: string;
  career_goal: string;
  timeline_months: number;
}

export interface RoadmapResponse {
  career_goal: string;
  timeline_months: number;
  roadmap: RoadmapMonth[];
}

// --- Future Simulation ---
export interface ScenarioDetail {
  job_title: string;
  salary_range: string;
  certifications: string[];
  skills_acquired: string[];
  description: string;
}

export interface FutureScenarios {
  best_case: ScenarioDetail;
  expected: ScenarioDetail;
  worst_case: ScenarioDetail;
}

export interface SimulationRequest {
  user_id: string;
  career_goal: string;
  timeline_months: number;
}

export interface SimulationResponse {
  career_goal: string;
  timeline_months: number;
  scenarios: FutureScenarios;
}

// --- AI Chat ---
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  user_id: string;
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
}

// --- Assessment Form State ---
export interface AssessmentFormData {
  name: string;
  email: string;
  education: string;
  skills: string[];
  career_goal: string;
  budget: number;
  timeline_months: number;
}
