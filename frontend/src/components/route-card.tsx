"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, Star, TrendingUp } from "lucide-react";
import type { CareerRoute } from "@/types";

interface RouteCardProps {
  route: CareerRoute;
  index: number;
  onSelect?: () => void;
}

const typeConfig: Record<string, { gradient: string; border: string; icon: string }> = {
  fast_track: {
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20",
    icon: "⚡",
  },
  budget_friendly: {
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    icon: "💰",
  },
  advanced: {
    gradient: "from-indigo-500/10 to-violet-500/5",
    border: "border-indigo-500/20",
    icon: "🚀",
  },
};

export default function RouteCard({ route, index, onSelect }: RouteCardProps) {
  const config = typeConfig[route.type] || typeConfig.advanced;
  const difficultyStars = route.difficulty === "Hard" ? 3 : route.difficulty === "Medium" ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`relative rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm p-6 hover:scale-[1.02] transition-all duration-300 group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-2xl">{config.icon}</span>
          <h3 className="text-lg font-bold text-white mt-2">{route.name}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
            {route.type.replace(/_/g, " ")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {route.success_score}%
          </div>
          <p className="text-xs text-slate-500">Success Rate</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-white/5 p-3 text-center">
          <Clock className="h-4 w-4 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Duration</p>
          <p className="text-sm font-semibold text-white">{route.total_duration}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-center">
          <DollarSign className="h-4 w-4 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Cost</p>
          <p className="text-sm font-semibold text-white">{route.total_cost}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-center">
          <Star className="h-4 w-4 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Difficulty</p>
          <p className="text-sm font-semibold text-white">
            {"★".repeat(difficultyStars)}{"☆".repeat(3 - difficultyStars)}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Steps</p>
        {route.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{step.step}</p>
              <p className="text-xs text-slate-500">
                {step.resource} · {step.duration} · {step.cost}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {onSelect && (
        <button
          onClick={onSelect}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Select Route
        </button>
      )}
    </motion.div>
  );
}
