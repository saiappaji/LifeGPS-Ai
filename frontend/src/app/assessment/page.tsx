"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Rocket,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SkillBadge from "@/components/skill-badge";
import LoadingSpinner from "@/components/loading-spinner";
import { api } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import type { AssessmentFormData } from "@/types";

// ── Constants ──────────────────────────────────────────────

const EDUCATION_OPTIONS = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Self-Taught",
  "Bootcamp Graduate",
];

const CAREER_GOALS = [
  "Full-Stack Developer",
  "Data Scientist",
  "Cloud Engineer",
  "UX Designer",
  "Cybersecurity Analyst",
  "Mobile App Developer",
  "DevOps Engineer",
  "AI/ML Engineer",
  "Product Manager",
  "Backend Developer",
];

const STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Skills & Goal", icon: Briefcase },
  { label: "Budget & Timeline", icon: DollarSign },
] as const;

// ── Animations ─────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.96,
  }),
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ── Component ──────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter();
  const { setProfileResponse } = useUser();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState<AssessmentFormData>({
    name: "",
    email: "",
    education: "",
    skills: [],
    career_goal: "",
    budget: 0,
    timeline_months: 6,
  });

  // ── Helpers ────────────────────────────────────────────

  const updateField = <K extends keyof AssessmentFormData>(
    key: K,
    value: AssessmentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      updateField("skills", [...formData.skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    updateField(
      "skills",
      formData.skills.filter((s) => s !== skill)
    );
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // ── Validation ─────────────────────────────────────────

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!formData.name.trim()) {
        setError("Please enter your name.");
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!formData.education) {
        setError("Please select your education level.");
        return false;
      }
    }
    if (step === 1) {
      if (formData.skills.length === 0) {
        setError("Please add at least one skill.");
        return false;
      }
      if (!formData.career_goal) {
        setError("Please select a career goal.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.budget || formData.budget <= 0) {
        setError("Please enter a valid budget.");
        return false;
      }
      if (!formData.timeline_months || formData.timeline_months <= 0) {
        setError("Please enter a valid timeline.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
    setError(null);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    setError(null);
  };

  // ── Submit ─────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.createProfile({
        name: formData.name,
        email: formData.email,
        education: formData.education,
        skills: formData.skills,
        career_goal: formData.career_goal,
        budget: formData.budget,
        timeline_months: formData.timeline_months,
      });

      setProfileResponse(response, {
        name: formData.name,
        email: formData.email,
        education: formData.education,
        skills: formData.skills,
        career_goal: formData.career_goal,
        budget: formData.budget,
        timeline_months: formData.timeline_months,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // ── Full-page loading overlay ──────────────────────────

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 opacity-20 animate-ping" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              Analyzing your profile...
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Our AI is calculating your career readiness score
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4 sm:px-6">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-medium mb-4"
          >
            <Rocket className="h-3.5 w-3.5" />
            Career Assessment
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Let&apos;s map your{" "}
            <span className="gradient-text">career journey</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Tell us about yourself so our AI can build your personalized roadmap
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;

            return (
              <div key={i} className="flex items-center">
                {/* Step circle */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent shadow-lg shadow-indigo-500/30"
                        : isActive
                          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                          : "border-white/10 bg-white/5"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 transition-colors ${
                          isActive ? "text-indigo-400" : "text-slate-500"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-2 whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-indigo-400"
                        : isCompleted
                          ? "text-indigo-400/70"
                          : "text-slate-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </motion.div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="w-16 sm:w-24 h-0.5 mx-2 sm:mx-3 rounded-full overflow-hidden bg-white/5 mb-5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: i < step ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-card p-6 sm:p-8"
            >
              {/* Step 1: Personal Info */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-400" />
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-400">
                      Help us get to know you better
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm text-slate-300"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g. Alex Johnson"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm text-slate-300"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">
                        Education Level
                      </Label>
                      <Select
                        value={formData.education}
                        onValueChange={(v) => { if (v) updateField("education", v); }}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 focus:ring-indigo-500/20">
                          <SelectValue placeholder="Select your education" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          {EDUCATION_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt}
                              value={opt}
                              className="text-white focus:bg-indigo-500/15 focus:text-indigo-300"
                            >
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Skills & Goal */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-indigo-400" />
                      Skills &amp; Career Goal
                    </h2>
                    <p className="text-sm text-slate-400">
                      What do you know, and where do you want to go?
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">
                        Your Skills
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a skill and press Enter"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11 flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addSkill}
                          disabled={!skillInput.trim()}
                          className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/25 h-11 px-4 shrink-0"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Skill badges */}
                      {formData.skills.length > 0 && (
                        <motion.div
                          layout
                          className="flex flex-wrap gap-2 mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                        >
                          <AnimatePresence mode="popLayout">
                            {formData.skills.map((skill) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                              >
                                <SkillBadge
                                  skill={skill}
                                  removable
                                  onRemove={() => removeSkill(skill)}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}

                      {formData.skills.length === 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          e.g. Python, React, SQL, Docker...
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">
                        Career Goal
                      </Label>
                      <Select
                        value={formData.career_goal}
                        onValueChange={(v) => { if (v) updateField("career_goal", v); }}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 focus:ring-indigo-500/20">
                          <SelectValue placeholder="Where do you want to be?" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          {CAREER_GOALS.map((goal) => (
                            <SelectItem
                              key={goal}
                              value={goal}
                              className="text-white focus:bg-indigo-500/15 focus:text-indigo-300"
                            >
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-indigo-400" />
                      Budget &amp; Timeline
                    </h2>
                    <p className="text-sm text-slate-400">
                      How much can you invest, and how fast do you want to move?
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="budget"
                        className="text-sm text-slate-300"
                      >
                        Learning Budget (USD)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          $
                        </span>
                        <Input
                          id="budget"
                          type="number"
                          min={0}
                          placeholder="5000"
                          value={formData.budget || ""}
                          onChange={(e) =>
                            updateField("budget", Number(e.target.value))
                          }
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11 pl-7"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Total amount you can invest in courses, certs, and tools
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="timeline"
                        className="text-sm text-slate-300"
                      >
                        Timeline (months)
                      </Label>
                      <div className="relative">
                        <Input
                          id="timeline"
                          type="number"
                          min={1}
                          max={60}
                          placeholder="6"
                          value={formData.timeline_months || ""}
                          onChange={(e) =>
                            updateField(
                              "timeline_months",
                              Number(e.target.value)
                            )
                          }
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        How many months to reach your career goal?
                      </p>
                    </div>
                  </div>

                  {/* Summary preview */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10">
                    <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider mb-3">
                      Quick Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name</span>
                        <span className="text-white font-medium">
                          {formData.name || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Goal</span>
                        <span className="text-white font-medium">
                          {formData.career_goal || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Skills</span>
                        <span className="text-white font-medium">
                          {formData.skills.length} added
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budget</span>
                        <span className="text-white font-medium">
                          {formData.budget
                            ? `$${formData.budget.toLocaleString()}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className={`text-slate-400 hover:text-white hover:bg-white/5 gap-2 transition-all ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 2 ? (
            <Button
              onClick={goNext}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border-0 gap-2 transition-all px-6 h-11"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border-0 gap-2 transition-all px-8 h-11"
            >
              <Rocket className="h-4 w-4" />
              Launch My GPS
            </Button>
          )}
        </div>

        {/* Step indicator text */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Step {step + 1} of {STEPS.length}
        </p>
      </motion.div>
    </div>
  );
}
