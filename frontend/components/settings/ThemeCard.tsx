"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const themes = [
  {
    id: "light",
    title: "Light",
    description: "Bright and clean interface.",
    icon: Sun,
  },
  {
    id: "dark",
    title: "Dark",
    description: "Comfortable viewing in low light.",
    icon: Moon,
  },
  {
    id: "system",
    title: "System",
    description: "Match your operating system.",
    icon: Monitor,
  },
] as const;

export default function ThemeCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="rounded-2xl border-border/80 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sun className="size-5" /></div>
        <CardTitle className="mt-3 text-xl">Appearance</CardTitle>

        <p className="text-sm text-muted-foreground">
          Choose how PathWise AI looks.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((item) => {
            const Icon = item.icon;

            const active = theme === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  active
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "hover:border-primary"
                )}
              >
                <div
                  className={cn(
                    "mb-5 flex h-12 w-12 items-center justify-center rounded-xl",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>

                {active && (
                  <div className="mt-5 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Active
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
