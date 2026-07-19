import { CalendarDays, Flame, Target, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface HeaderProps {
  userName: string;
  targetRole: string;
  currentWeek: number;
  totalWeeks: number;
  completion: number;
  streak: number;
  xp: number;
}

export default function Header({
  userName,
  targetRole,
  currentWeek,
  totalWeeks,
  completion,
  streak,
  xp,
}: HeaderProps) {
  return (
    <section className="space-y-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium text-primary">
            AI Powered Learning Roadmap
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground leading-7">
            Continue progressing toward becoming a{" "}
            <span className="font-semibold text-primary">
              {targetRole}
            </span>
            . Every completed task brings you one step closer to your career goal.
          </p>

        </div>

        <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-sm">

          <div className="text-center">

            <p className="text-sm text-muted-foreground">
              Roadmap Progress
            </p>

            <h2 className="mt-2 text-5xl font-bold text-primary">
              {completion}%
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Week {currentWeek} of {totalWeeks}
            </p>

          </div>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <Card className="rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="rounded-xl bg-orange-500/10 p-3">
              <Flame className="h-7 w-7 text-orange-500" />
            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Learning Streak
              </p>

              <h3 className="text-2xl font-bold">
                {streak} Days
              </h3>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="rounded-xl bg-blue-500/10 p-3">
              <Trophy className="h-7 w-7 text-blue-500" />
            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Total XP
              </p>

              <h3 className="text-2xl font-bold">
                {xp}
              </h3>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="rounded-xl bg-green-500/10 p-3">
              <Target className="h-7 w-7 text-green-600" />
            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Current Goal
              </p>

              <h3 className="text-lg font-semibold">
                {targetRole}
              </h3>

            </div>

          </CardContent>

        </Card>

      </div>

      <Card className="rounded-2xl">

        <CardContent className="flex items-center gap-4 p-6">

          <CalendarDays className="h-7 w-7 text-primary" />

          <div>

            <h3 className="font-semibold">
              Current Learning Phase
            </h3>

            <p className="text-muted-foreground">
              You're currently working through Week {currentWeek}. Stay
              consistent and complete your weekly milestones to unlock new
              achievements.
            </p>

          </div>

        </CardContent>

      </Card>

    </section>
  );
}