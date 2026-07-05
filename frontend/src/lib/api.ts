// =============================================
// LifeGPS AI - API Service Layer
// =============================================

import type {
  ProfileRequest,
  ProfileResponse,
  SkillGapRequest,
  SkillGapResponse,
  RoutesRequest,
  RoutesResponse,
  RoadmapRequest,
  RoadmapResponse,
  SimulationRequest,
  SimulationResponse,
  ChatRequest,
  ChatResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new ApiError(
      `API Error: ${res.status} - ${errorText}`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}

export const api = {
  /** Submit user profile and get readiness assessment */
  createProfile: (data: ProfileRequest) =>
    request<ProfileResponse>("/api/profile", data),

  /** Get skill gap analysis */
  analyzeSkillGap: (data: SkillGapRequest) =>
    request<SkillGapResponse>("/api/skill-gap", data),

  /** Get career route options */
  getRoutes: (data: RoutesRequest) =>
    request<RoutesResponse>("/api/routes", data),

  /** Get personalized learning roadmap */
  getRoadmap: (data: RoadmapRequest) =>
    request<RoadmapResponse>("/api/roadmap", data),

  /** Get future self simulation */
  simulateFuture: (data: SimulationRequest) =>
    request<SimulationResponse>("/api/future-simulation", data),

  /** Send chat message to AI advisor */
  chat: (data: ChatRequest) =>
    request<ChatResponse>("/api/chat", data),
};

export { ApiError };
