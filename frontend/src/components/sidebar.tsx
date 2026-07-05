"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  Map,
  Sparkles,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/routes", label: "Career Routes", icon: GitFork },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/simulator", label: "Simulator", icon: Sparkles },
  { href: "/advisor", label: "AI Advisor", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, clearUser } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-40 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* User greeting */}
      {!collapsed && (
        <div className="p-4 border-b border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Welcome back</p>
          <p className="text-sm font-semibold text-white truncate mt-0.5">
            {user.name || "Explorer"}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-400 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? link.label : undefined}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  active
                    ? "text-indigo-400"
                    : "text-slate-500 group-hover:text-white"
                }`}
              />
              {!collapsed && <span>{link.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={clearUser}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          title={collapsed ? "Reset" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Reset Profile</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
