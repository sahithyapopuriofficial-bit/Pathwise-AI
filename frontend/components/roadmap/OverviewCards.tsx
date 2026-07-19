import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface OverviewCardsProps {
  tasksCompleted: number;
  totalTasks: number;
  skillsCompleted: number;
  totalSkills: number;
  projectsCompleted: number;
  studyHours: number;
  remainingWeeks: number;
}

export default function OverviewCards({
  tasksCompleted,
  totalTasks,
  skillsCompleted,
  totalSkills,
  projectsCompleted,
  studyHours,
  remainingWeeks,
}: OverviewCardsProps) {
  const cards = [
    {
      title: "Tasks Completed",
      value: `${tasksCompleted}/${totalTasks}`,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "Skills Mastered",
      value: `${skillsCompleted}/${totalSkills}`,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Projects Finished",
      value: projectsCompleted,
      icon: Briefcase,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Study Hours",
      value: `${studyHours} hrs`,
      icon: Clock3,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      title: "Weeks Remaining",
      value: remainingWeeks,
      icon: Layers3,
      color: "text-pink-600",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Learning Overview
        </h2>

        <p className="text-muted-foreground">
          Your roadmap progress at a glance.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="rounded-2xl border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
                >
                  <Icon
                    className={`h-7 w-7 ${card.color}`}
                  />
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold tracking-tight">
                  {card.value}
                </h3>

              </CardContent>
            </Card>
          );
        })}

      </div>

    </section>
  );
}