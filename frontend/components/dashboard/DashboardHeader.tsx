"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { KeyRound, LogOut, Settings, UserRound, Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps {
  fullName?: string;
}

const dashboardSections = [
  { id: "analytics", label: "Analytics", keywords: ["analytics", "dashboard"] },
  { id: "resume-upload", label: "Resume", keywords: ["resume", "resume upload", "resume analysis", "upload", "analyzer"] },
  { id: "assessment", label: "Skill Assessment", keywords: ["assessment", "skill assessment"] },
  { id: "skill-gap-analysis", label: "Skill Gap Analysis", keywords: ["skill gap", "gap analysis"] },
  { id: "career-insights", label: "Career Insights", keywords: ["career insights", "insights"] },
  { id: "job-recommendations", label: "Job Recommendations", keywords: ["jobs", "job recommendations", "recommendations"] },
  { id: "roadmap", label: "Learning Roadmap", keywords: ["roadmap", "learning roadmap"] },
  { id: "mock-interview", label: "AI Mock Interview", keywords: ["mock interview", "interview"] },
  { id: "career-mentor", label: "Career Mentor", keywords: ["career mentor", "mentor"] },
];

export default function DashboardHeader({
  fullName,
}: DashboardHeaderProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
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

  useEffect(() => {
    let isMounted = true;

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (isMounted) {
        setEmail(user?.email ?? "");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    const closeAccountMenu = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeAccountMenu);
    return () => document.removeEventListener("mousedown", closeAccountMenu);
  }, []);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return dashboardSections.filter(({ label, keywords }) =>
      [label.toLowerCase(), ...keywords].some((value) =>
        value.includes(normalizedQuery),
      ),
    );
  }, [query]);

  const navigateToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (suggestions[0]) {
      navigateToSection(suggestions[0].id);
    }
  };

  const navigateTo = (path: string) => {
    setIsAccountMenuOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.replace("/login");
      router.refresh();
    }

    setIsLoggingOut(false);
  };

  const focusMenuItem = (direction: 1 | -1) => {
    const menuItems = Array.from(
      accountMenuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    );

    if (!menuItems.length) {
      return;
    }

    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex =
      currentIndex === -1
        ? direction === 1 ? 0 : menuItems.length - 1
        : (currentIndex + direction + menuItems.length) % menuItems.length;

    menuItems[nextIndex].focus();
  };

  return (
    <header className="flex items-center justify-between border-b bg-card px-8 py-5 shadow-sm">
      {/* Left Section */}
      <div>
        <p className="text-sm text-muted-foreground">
          {today}
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Welcome back, {safeName} 👋
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <form
            className="flex items-center gap-2 rounded-xl border bg-muted px-3 py-2"
            onSubmit={handleSubmit}
          >
            <Search className="h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
          </form>

          {isOpen && suggestions.length > 0 && (
            <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg">
              {suggestions.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted"
                  onClick={() => navigateToSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Account */}
        <div
          ref={accountMenuRef}
          className="relative"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsAccountMenuOpen(false);
              accountTriggerRef.current?.focus();
            }

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              const direction = event.key === "ArrowDown" ? 1 : -1;

              if (!isAccountMenuOpen) {
                setIsAccountMenuOpen(true);
                requestAnimationFrame(() => focusMenuItem(direction));
                return;
              }

              focusMenuItem(direction);
            }
          }}
        >
          <button
            ref={accountTriggerRef}
            type="button"
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
          >
            {initials}
          </button>

          {isAccountMenuOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover py-2 shadow-lg"
            >
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-popover-foreground">{safeName}</p>
                  <p className="truncate text-xs text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="py-1">
                <button type="button" role="menuitem" className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted" onClick={() => navigateTo("/dashboard/profile")}>
                  <UserRound className="h-4 w-4" /> My Profile
                </button>
                <button type="button" role="menuitem" className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted" onClick={() => navigateTo("/dashboard/settings")}>
                  <Settings className="h-4 w-4" /> Account Settings
                </button>
                <button type="button" role="menuitem" className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted" onClick={() => navigateTo("/dashboard/settings")}>
                  <KeyRound className="h-4 w-4" /> Change Password
                </button>
              </div>

              <div className="border-t pt-1">
                <button type="button" role="menuitem" disabled={isLoggingOut} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

