"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, BookOpen, Trophy } from "lucide-react";
import type { RoadmapMonth } from "@/types";

interface TimelineItemProps {
  month: RoadmapMonth;
  index: number;
  total: number;
  status?: "completed" | "current" | "upcoming";
}

export default function TimelineItem({
  month,
  index,
  total,
  status = "upcoming",
}: TimelineItemProps) {
  const statusStyles = {
    completed: {
      line: "bg-emerald-500",
      dot: "bg-emerald-500 shadow-emerald-500/30",
      card: "border-emerald-500/20 bg-emerald-500/5",
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    },
    current: {
      line: "bg-indigo-500",
      dot: "bg-indigo-500 shadow-indigo-500/30 animate-pulse",
      card: "border-indigo-500/20 bg-indigo-500/5",
      icon: <Circle className="h-5 w-5 text-indigo-400" />,
    },
    upcoming: {
      line: "bg-white/10",
      dot: "bg-slate-700 shadow-none",
      card: "border-white/5 bg-white/[0.02]",
      icon: <Circle className="h-5 w-5 text-slate-600" />,
    },
  };

  const styles = statusStyles[status];
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex gap-4"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.dot} shadow-lg`}
        >
          {styles.icon}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[40px] ${styles.line} transition-colors`} />
        )}
      </div>

      {/* Content card */}
      <div
        className={`flex-1 rounded-2xl border ${styles.card} p-5 mb-4 backdrop-blur-sm hover:bg-white/[0.04] transition-colors`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Month {month.month}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{month.title}</h3>
          </div>
          {month.milestone && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">{month.milestone}</span>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="space-y-2 mb-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasks</p>
          {month.tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 mt-1.5 shrink-0" />
              <span className="text-sm text-slate-300">{task}</span>
            </div>
          ))}
        </div>

        {/* Resources */}
        {month.resources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Resources
            </p>
            <div className="flex flex-wrap gap-2">
              {month.resources.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5"
                >
                  <BookOpen className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-400">{res}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
