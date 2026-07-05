"use client";

import { Badge } from "@/components/ui/badge";

interface SkillBadgeProps {
  skill: string;
  variant?: "default" | "missing" | "acquired" | "outline";
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

export default function SkillBadge({
  skill,
  variant = "default",
  removable = false,
  onRemove,
  onClick,
  selected = false,
}: SkillBadgeProps) {
  const variantStyles = {
    default:
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
    missing:
      "bg-red-500/10 text-red-400 border-red-500/20",
    acquired:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    outline:
      "bg-transparent text-slate-400 border-white/10 hover:bg-white/5 hover:text-white",
  };

  const selectedStyles = selected
    ? "ring-2 ring-indigo-500 bg-indigo-500/20 text-indigo-300"
    : "";

  return (
    <Badge
      className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-all duration-200 cursor-default ${variantStyles[variant]} ${selectedStyles} ${
        onClick ? "cursor-pointer hover:scale-105" : ""
      }`}
      onClick={onClick}
    >
      {skill}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </Badge>
  );
}
