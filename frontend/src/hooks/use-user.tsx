"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ProfileResponse } from "@/types";

interface UserState {
  user_id: string | null;
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

interface UserContextType {
  user: UserState;
  setUser: (data: Partial<UserState>) => void;
  setProfileResponse: (profile: ProfileResponse, formData: Partial<UserState>) => void;
  clearUser: () => void;
  isOnboarded: boolean;
}

const defaultUser: UserState = {
  user_id: null,
  name: "",
  email: "",
  education: "",
  skills: [],
  career_goal: "",
  budget: 0,
  timeline_months: 6,
  readiness_score: 0,
  profile_summary: "",
  skill_gap: [],
  recommendations: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "lifegps-user";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserState>(defaultUser);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserState;
        setUserState(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user, hydrated]);

  const setUser = useCallback((data: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...data }));
  }, []);

  const setProfileResponse = useCallback(
    (profile: ProfileResponse, formData: Partial<UserState>) => {
      setUserState((prev) => ({
        ...prev,
        ...formData,
        user_id: profile.user_id,
        readiness_score: profile.readiness_score,
        profile_summary: profile.profile_summary,
        skill_gap: profile.skill_gap,
        recommendations: profile.recommendations,
      }));
    },
    []
  );

  const clearUser = useCallback(() => {
    setUserState(defaultUser);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isOnboarded = !!user.user_id;

  if (!hydrated) {
    return null; // Prevent hydration mismatch
  }

  return (
    <UserContext.Provider value={{ user, setUser, setProfileResponse, clearUser, isOnboarded }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
