"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Route,
  FileText,
  Bot,
  TrendingUp,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Career Goals",
    href: "/dashboard/career-goals",
    icon: Target,
  },
  {
    title: "Skill Analysis",
    href: "/dashboard/skill-analysis",
    icon: BarChart3,
  },
  {
    title: "Learning Roadmap",
    href: "/dashboard/roadmap",
    icon: Route,
  },
  {
    title: "Resume Analyzer",
    href: "/dashboard/resume",
    icon: FileText,
  },
  {
    title: "AI Mentor",
    href: "/dashboard/mentor",
    icon: Bot,
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: TrendingUp,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg">
      {/* Logo */}
      <div className="border-b p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3 text-white">
            <Sparkles className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              PathWise AI
            </h1>

            <p className="text-sm text-muted-foreground">
              AI Career Mentor
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-5">
        <div className="rounded-xl bg-sidebar-accent p-4 text-center">
          <p className="text-sm font-semibold text-sidebar-accent-foreground">
            PathWise AI
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Version 1.0
          </p>
        </div>
      </div>
    </aside>
  );
}

