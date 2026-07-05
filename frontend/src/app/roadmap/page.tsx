"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map, AlertTriangle, RefreshCw, Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import TimelineItem from "@/components/timeline-item";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { api } from "@/lib/api";
import type { RoadmapMonth } from "@/types";

export default function RoadmapPage() {
  const router = useRouter();
  const { user, isOnboarded } = useUser();

  const [roadmap, setRoadmap] = useState<RoadmapMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not onboarded
  useEffect(() => {
    if (!isOnboarded) {
      router.replace("/assessment");
    }
  }, [isOnboarded, router]);

  const fetchRoadmap = useCallback(async () => {
    if (!user.user_id || !user.career_goal) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getRoadmap({
        user_id: user.user_id,
        career_goal: user.career_goal,
        timeline_months: user.timeline_months,
      });
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load learning roadmap"
      );
    } finally {
      setLoading(false);
    }
  }, [user.user_id, user.career_goal, user.timeline_months]);

  useEffect(() => {
    if (isOnboarded) {
      fetchRoadmap();
    }
  }, [isOnboarded, fetchRoadmap]);

  if (!isOnboarded) return null;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Learning Roadmap
              </h1>
              <p className="text-sm text-slate-400">
                Your path to{" "}
                <span className="text-indigo-400 font-medium">
                  {user.career_goal}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">
                {user.timeline_months}-month timeline
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-3 max-w-2xl">
            A month-by-month learning plan with tasks, resources, and milestones
            to guide your career transition.
          </p>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Building your learning roadmap..." />}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Unable to Load Roadmap
            </h3>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <Button
              onClick={fetchRoadmap}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Roadmap Timeline */}
        {!loading && !error && roadmap.length > 0 && (
          <div className="max-w-3xl">
            {roadmap.map((month, index) => (
              <TimelineItem
                key={month.month}
                month={month}
                index={index}
                total={roadmap.length}
                status={index === 0 ? "current" : "upcoming"}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && roadmap.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Map className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Roadmap Available
            </h3>
            <p className="text-sm text-slate-400">
              We couldn&apos;t generate a roadmap at this time. Please try again
              later.
            </p>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
