"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Target,
  GitFork,
  Map,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "AI identifies exactly which skills you need to bridge the gap between where you are and where you want to be.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: GitFork,
    title: "Career Routes",
    description:
      "Compare fast-track, budget-friendly, and advanced paths to your dream career with detailed steps.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Map,
    title: "Learning Roadmap",
    description:
      "Get a month-by-month personalized learning plan with tasks, resources, and milestone checkpoints.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Future Simulator",
    description:
      "See best-case, expected, and worst-case career scenarios based on your current trajectory.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: MessageSquare,
    title: "AI Career Advisor",
    description:
      "Chat with an intelligent AI advisor who understands your unique career context and goals.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Readiness Score",
    description:
      "Get an instant career readiness score with actionable recommendations to improve it.",
    gradient: "from-fuchsia-500 to-purple-500",
  },
];

const stats = [
  { value: "6+", label: "Career Paths" },
  { value: "AI", label: "Powered Analysis" },
  { value: "24/7", label: "AI Advisor" },
  { value: "100%", label: "Personalized" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen animated-gradient">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">
                AI-Powered Career Navigation
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Navigate Your Career</span>
              <br />
              <span className="gradient-text">with AI Precision</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              LifeGPS AI analyzes your skills, maps career paths, creates personalized
              roadmaps, and simulates your future — all powered by artificial intelligence.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assessment">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-6 text-lg font-semibold hover:from-indigo-600 hover:to-violet-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all border-0 rounded-xl group"
                >
                  Start Your Career Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/advisor">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Talk to AI Advisor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 glow-indigo"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Navigate Your Career</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Six powerful AI-driven tools working together to accelerate your
              professional growth.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className="glass-card glass-card-hover p-6 group cursor-default transition-all duration-300 hover:scale-[1.02]"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                desc: "Share your skills, education, and career goals in a simple 3-step form.",
                icon: Shield,
              },
              {
                step: "02",
                title: "Get AI Analysis",
                desc: "Our AI analyzes your profile and generates personalized career insights.",
                icon: Compass,
              },
              {
                step: "03",
                title: "Navigate Forward",
                desc: "Follow your roadmap, compare routes, and chat with your AI advisor.",
                icon: Sparkles,
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-xl" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-white/10 flex items-center justify-center">
                    <s.icon className="h-7 w-7 text-indigo-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-indigo-400 mb-2">
                  STEP {s.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 sm:p-14 glow-indigo"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Find Your Path?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join LifeGPS AI and get your personalized career navigation plan
              in minutes.
            </p>
            <Link href="/assessment">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-10 py-6 text-lg font-semibold hover:from-indigo-600 hover:to-violet-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all border-0 rounded-xl group"
              >
                Start Your Career Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Compass className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold gradient-text">LifeGPS AI</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2024 LifeGPS AI. AI-Powered Career Navigation Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
