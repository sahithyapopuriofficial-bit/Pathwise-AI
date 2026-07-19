import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  Clock3,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatisticsProps {
  completedWeeks: number;
  totalWeeks: number;
  studyHours: number;
  skillsCompleted: number;
  projectsCompleted: number;
  averageDailyHours: number;
}

export default function Statistics({
  completedWeeks,
  totalWeeks,
  studyHours,
  skillsCompleted,
  projectsCompleted,
  averageDailyHours,
}: StatisticsProps) {
  const completion =
    totalWeeks === 0
      ? 0
      : Math.round((completedWeeks / totalWeeks) * 100);

  const stats = [
    {
      title: "Roadmap Completion",
      value: `${completion}%`,
      subtitle: `${completedWeeks}/${totalWeeks} Weeks`,
      icon: TrendingUp,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      title: "Study Hours",
      value: studyHours,
      subtitle: "Hours Invested",
      icon: Clock3,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Skills Mastered",
      value: skillsCompleted,
      subtitle: "Technical Skills",
      icon: BookOpen,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      title: "Projects",
      value: projectsCompleted,
      subtitle: "Portfolio Projects",
      icon: Briefcase,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Daily Average",
      value: `${averageDailyHours}h`,
      subtitle: "Learning / Day",
      icon: Activity,
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Learning Analytics
        </h2>

        <p className="text-muted-foreground">
          Measure your consistency and overall roadmap performance.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="pb-3">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <Icon
                    className={`h-6 w-6 ${item.iconColor}`}
                  />
                </div>

              </CardHeader>

              <CardContent>

                <CardTitle className="text-sm text-muted-foreground">
                  {item.title}
                </CardTitle>

                <h3 className="mt-3 text-3xl font-bold">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.subtitle}
                </p>

              </CardContent>

            </Card>
          );
        })}

      </div>

      <Card className="rounded-2xl">

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <BarChart3 className="h-5 w-5 text-primary" />

            Performance Summary

          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="space-y-5">

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span>Overall Completion</span>

                <span>{completion}%</span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">

                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width: `${completion}%`,
                  }}
                />

              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-sm text-muted-foreground">
                  Weekly Consistency
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Excellent
                </h3>

              </div>

              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-sm text-muted-foreground">
                  Learning Pace
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  On Track
                </h3>

              </div>

              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-sm text-muted-foreground">
                  Goal Status
                </p>

                <h3 className="mt-2 text-xl font-bold text-green-600">
                  Progressing
                </h3>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

    </section>
  );
}