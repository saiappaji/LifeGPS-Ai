"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, AlertTriangle, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import RouteCard from "@/components/route-card";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { api } from "@/lib/api";
import type { CareerRoute } from "@/types";

export default function RoutesPage() {
  const router = useRouter();
  const { user, isOnboarded } = useUser();

  const [routes, setRoutes] = useState<CareerRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not onboarded
  useEffect(() => {
    if (!isOnboarded) {
      router.replace("/assessment");
    }
  }, [isOnboarded, router]);

  const fetchRoutes = useCallback(async () => {
    if (!user.user_id || !user.career_goal) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getRoutes({
        user_id: user.user_id,
        career_goal: user.career_goal,
      });
      setRoutes(data.routes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load career routes"
      );
    } finally {
      setLoading(false);
    }
  }, [user.user_id, user.career_goal]);

  useEffect(() => {
    if (isOnboarded) {
      fetchRoutes();
    }
  }, [isOnboarded, fetchRoutes]);

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
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Career Routes</h1>
              <p className="text-sm text-slate-400">
                Explore pathways to{" "}
                <span className="text-indigo-400 font-medium">
                  {user.career_goal}
                </span>
              </p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Compare different career paths tailored to your skills, budget, and
            timeline. Each route offers a unique balance of speed, cost, and
            difficulty.
          </p>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Generating career routes..." />}

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
              Unable to Load Routes
            </h3>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <Button
              onClick={fetchRoutes}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Routes Grid */}
        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route, index) => (
              <RouteCard key={index} route={route} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && routes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Compass className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Routes Available
            </h3>
            <p className="text-sm text-slate-400">
              We couldn&apos;t find any career routes at this time. Please try
              again later.
            </p>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
