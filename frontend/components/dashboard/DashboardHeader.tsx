"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  fullName?: string;
}

export default function DashboardHeader({
  fullName,
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Safe fallback
  const safeName = fullName?.trim() || "User";

  const initials = safeName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5 shadow-sm">
      {/* Left Section */}
      <div>
        <p className="text-sm text-slate-500">
          {today}
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Welcome back, {safeName} 👋
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}

