"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GitFork,
  Map,
  Sparkles,
  MessageSquare,
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import ScoreGauge from "@/components/score-gauge";
import SkillBadge from "@/components/skill-badge";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

// ── Animations ─────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ── Quick Links Data ───────────────────────────────────────

const quickLinks = [
  {
    href: "/routes",
    label: "Career Routes",
    description: "Explore pathways to your dream role",
    icon: GitFork,
    gradient: "from-blue-500/15 to-cyan-500/10",
    iconColor: "text-blue-400",
    borderHover: "hover:border-blue-500/30",
  },
  {
    href: "/roadmap",
    label: "Learning Roadmap",
    description: "Your month-by-month learning plan",
    icon: Map,
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
  },
  {
    href: "/simulator",
    label: "Future Simulator",
    description: "See where you could be in months",
    icon: Sparkles,
    gradient: "from-violet-500/15 to-purple-500/10",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/30",
  },
  {
    href: "/advisor",
    label: "AI Advisor",
    description: "Chat with your career AI assistant",
    icon: MessageSquare,
    gradient: "from-amber-500/15 to-orange-500/10",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/30",
  },
];

// ── Component ──────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { user, isOnboarded } = useUser();

  useEffect(() => {
    if (!isOnboarded) {
      router.push("/assessment");
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) {
    return null;
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-6xl"
      >
        {/* ── Header ──────────────────────────────────── */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back,{" "}
              <span className="gradient-text">
                {user.name || "Explorer"}
              </span>
            </h1>
            {user.career_goal && (
              <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 text-xs font-medium">
                <Target className="h-3 w-3 mr-1.5" />
                {user.career_goal}
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            Here&apos;s your AI-powered career analysis at a glance
          </p>
        </motion.div>

        {/* ── Score Gauge (Hero) ───────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-8 flex flex-col items-center glow-indigo">
            <ScoreGauge
              score={user.readiness_score}
              size={220}
              label="Career Readiness Score"
              sublabel={`Target: ${user.career_goal}`}
            />
            <p className="text-xs text-slate-500 mt-4 max-w-md text-center">
              This score reflects how prepared you are for your target role based
              on your current skills, education, and experience.
            </p>
          </div>
        </motion.div>

        {/* ── Profile Summary + Skills Row ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Summary */}
          <motion.div variants={itemVariants}>
            <div className="glass-card p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/15 to-violet-500/10">
                  <Lightbulb className="h-4 w-4 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Profile Summary
                </h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {user.profile_summary || "Complete your assessment to see your AI-generated profile summary."}
              </p>
            </div>
          </motion.div>

          {/* Current Skills */}
          <motion.div variants={itemVariants}>
            <div className="glass-card p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/10">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Current Skills
                </h2>
                <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  {user.skills.length} skills
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} variant="acquired" />
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No skills added yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Skill Gap ───────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/15 to-orange-500/10">
                <TrendingUp className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Skill Gap Analysis
              </h2>
              {user.skill_gap.length > 0 && (
                <Badge className="ml-auto bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                  {user.skill_gap.length} to learn
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Skills you need to acquire to become a {user.career_goal || "professional"}
            </p>
            <div className="flex flex-wrap gap-2">
              {user.skill_gap.length > 0 ? (
                user.skill_gap.map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="missing" />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No skill gaps identified — you&apos;re all set! 🎉
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Recommendations ─────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-purple-500/10">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                AI Recommendations
              </h2>
            </div>
            {user.recommendations.length > 0 ? (
              <ol className="space-y-3">
                {user.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex gap-3 items-start group"
                  >
                    <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold mt-0.5 shadow-sm shadow-indigo-500/20">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                      {rec}
                    </p>
                  </motion.li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">
                Complete your assessment to receive personalized recommendations.
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Quick Links ─────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-white mb-4">
            Explore Your Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <Link href={link.href} className="block group">
                    <div
                      className={`glass-card glass-card-hover p-5 transition-all duration-300 ${link.borderHover} hover:shadow-lg cursor-pointer`}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`h-5 w-5 ${link.iconColor}`} />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-white/90">
                        {link.label}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {link.description}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
