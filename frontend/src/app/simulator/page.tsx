"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles, Calendar, Target } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import ScenarioCard from "@/components/scenario-card";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { api } from "@/lib/api";
import type { SimulationResponse } from "@/types";

export default function SimulatorPage() {
  const router = useRouter();
  const { user, isOnboarded } = useUser();

  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not onboarded
  useEffect(() => {
    if (!isOnboarded) {
      router.replace("/assessment");
    }
  }, [isOnboarded, router]);

  const fetchSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.simulateFuture({
        user_id: user.user_id!,
        career_goal: user.career_goal,
        timeline_months: user.timeline_months,
      });
      setSimulation(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to simulate your future. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch simulation on mount (only if onboarded)
  useEffect(() => {
    if (isOnboarded) {
      fetchSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnboarded]);

  if (!isOnboarded) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Future Self Simulator
            </h1>
          </div>

          {simulation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Target className="h-4 w-4 text-indigo-400" />
                <span className="text-sm text-slate-300">
                  {simulation.career_goal}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Calendar className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-slate-300">
                  {simulation.timeline_months}-month timeline
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Simulating your future..." />}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Simulation Failed
              </h3>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <Button
                onClick={fetchSimulation}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Scenario Cards Grid */}
        {simulation && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <ScenarioCard
              scenario={simulation.scenarios.best_case}
              type="best_case"
              index={0}
            />
            <ScenarioCard
              scenario={simulation.scenarios.expected}
              type="expected"
              index={1}
            />
            <ScenarioCard
              scenario={simulation.scenarios.worst_case}
              type="worst_case"
              index={2}
            />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
