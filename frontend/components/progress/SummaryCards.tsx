import {
  FileText,
  Mic,
  GraduationCap,
  BookOpen,
  Bot,
  Trophy,
} from "lucide-react";

interface SummaryCardsProps {
  summary: {
    resumeScore: number;
    highestInterviewScore: number;
    averageInterviewScore: number;
    assessmentAverage: number;
    roadmapCompletion: number;
    mentorSessions: number;
  };
}

const cards = [
  {
    key: "resumeScore",
    title: "Resume ATS",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    suffix: "%",
  },
  {
    key: "highestInterviewScore",
    title: "Best Interview",
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    suffix: "%",
  },
  {
    key: "averageInterviewScore",
    title: "Interview Avg",
    icon: Mic,
    color: "text-green-500",
    bg: "bg-green-500/10",
    suffix: "%",
  },
  {
    key: "assessmentAverage",
    title: "Assessment Avg",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    suffix: "%",
  },
  {
    key: "roadmapCompletion",
    title: "Roadmap",
    icon: BookOpen,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    suffix: "%",
  },
  {
    key: "mentorSessions",
    title: "AI Mentor",
    icon: Bot,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    suffix: "",
  },
] as const;

export default function SummaryCards({
  summary,
}: SummaryCardsProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Progress Summary
        </h2>

        <p className="text-muted-foreground">
          Your overall learning statistics at a glance.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          const value =
            summary[card.key as keyof typeof summary];

          return (
            <div
              key={card.key}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon
                    className={`h-6 w-6 ${card.color}`}
                  />
                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  LIVE
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <h3 className="mt-2 text-4xl font-bold tracking-tight">
                  {value}
                  {card.suffix}
                </h3>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width: `${Math.min(Number(value), 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}