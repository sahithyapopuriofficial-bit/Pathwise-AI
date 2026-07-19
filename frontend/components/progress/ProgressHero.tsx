import { TrendingUp, CalendarDays, Flame } from "lucide-react";

interface ProgressHeroProps {
  careerReadiness: number;
  streak: number;
  learningDays: number;
}

export default function ProgressHero({
  careerReadiness,
  streak,
  learningDays,
}: ProgressHeroProps) {
  const readinessColor =
    careerReadiness >= 80
      ? "text-green-500"
      : careerReadiness >= 60
      ? "text-yellow-500"
      : "text-red-500";

  const readinessText =
    careerReadiness >= 80
      ? "Interview Ready 🚀"
      : careerReadiness >= 60
      ? "Job Ready 💼"
      : "Keep Learning 📚";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-sm">

      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Your Progress
          </h1>

          <p className="max-w-2xl text-muted-foreground">
            Track your complete learning journey, monitor your career readiness,
            and stay on top of your AI-powered growth.
          </p>
        </div>

        {/* Main Grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-4">

          {/* Career Readiness */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md lg:col-span-2">
            <p className="text-sm text-muted-foreground">
              Career Readiness
            </p>

            <div className="mt-4 flex items-center gap-4">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <span className={`text-3xl font-bold ${readinessColor}`}>
                  {careerReadiness}%
                </span>
              </div>

              <div>
                <h2 className={`text-xl font-bold ${readinessColor}`}>
                  {readinessText}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Based on your resume, roadmap, interviews and assessments.
                </p>
              </div>

            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Current Streak
                </p>

                <h3 className="text-3xl font-bold">
                  {streak}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Keep learning consistently to maintain your streak.
            </p>
          </div>

          {/* Learning Days */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <CalendarDays className="h-6 w-6 text-blue-500" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Learning Days
                </p>

                <h3 className="text-3xl font-bold">
                  {learningDays}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Days you've been actively progressing on your roadmap.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />

          <p className="text-sm font-medium">
            Keep improving every week and watch your Career Readiness grow.
          </p>
        </div>

      </div>
    </section>
  );
}