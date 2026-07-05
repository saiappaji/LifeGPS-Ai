"use client";

import { motion } from "framer-motion";
import { Briefcase, DollarSign, Award, Cpu } from "lucide-react";
import type { ScenarioDetail } from "@/types";

interface ScenarioCardProps {
  scenario: ScenarioDetail;
  type: "best_case" | "expected" | "worst_case";
  index: number;
}

const typeConfig = {
  best_case: {
    label: "Best Case",
    emoji: "🌟",
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "hover:shadow-emerald-500/10",
  },
  expected: {
    label: "Expected",
    emoji: "🎯",
    gradient: "from-indigo-500/10 to-blue-500/5",
    border: "border-indigo-500/20",
    accent: "text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glow: "hover:shadow-indigo-500/10",
  },
  worst_case: {
    label: "Worst Case",
    emoji: "⚠️",
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20",
    accent: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "hover:shadow-amber-500/10",
  },
};

export default function ScenarioCard({ scenario, type, index }: ScenarioCardProps) {
  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className={`rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm p-6 hover:scale-[1.02] transition-all duration-300 shadow-xl ${config.glow}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <h3 className={`text-lg font-bold ${config.accent}`}>{config.label}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Scenario</p>
        </div>
      </div>

      {/* Job Title */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className={`h-4 w-4 ${config.accent}`} />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Position</span>
        </div>
        <p className="text-xl font-bold text-white">{scenario.job_title}</p>
      </div>

      {/* Salary */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className={`h-4 w-4 ${config.accent}`} />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Salary Range</span>
        </div>
        <p className={`text-lg font-bold ${config.accent}`}>{scenario.salary_range}</p>
      </div>

      {/* Certifications */}
      {scenario.certifications.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className={`h-4 w-4 ${config.accent}`} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Certifications
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.certifications.map((cert, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {scenario.skills_acquired.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className={`h-4 w-4 ${config.accent}`} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Skills Acquired
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.skills_acquired.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed">{scenario.description}</p>
    </motion.div>
  );
}
