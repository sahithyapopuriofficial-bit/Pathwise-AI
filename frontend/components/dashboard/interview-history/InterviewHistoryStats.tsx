import {
  FileText,
  Trophy,
  Target,
  CheckCircle2,
} from "lucide-react";

interface Stats {
  totalInterviews: number;
  completedInterviews: number;
  highestScore: number;
  averageScore: number;
}

interface InterviewHistoryStatsProps {
  stats: Stats;
}

export default function InterviewHistoryStats({
  stats,
}: InterviewHistoryStatsProps) {
  const cards = [
    {
      title: "Total Interviews",
      value: stats.totalInterviews,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats.completedInterviews,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Highest Score",
      value: `${stats.highestScore}/10`,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}/10`,
      icon: Target,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-full p-4 ${card.bg}`}
              >
                <Icon
                  className={`h-7 w-7 ${card.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}