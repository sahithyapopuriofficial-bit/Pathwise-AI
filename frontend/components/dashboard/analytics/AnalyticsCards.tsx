import {
  BarChart3,
  Trophy,
  Target,
  FileText,
  Brain,
  Map,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface AnalyticsData {
  totalInterviews: number;
  completedInterviews: number;
  averageInterviewScore: number;
  highestInterviewScore: number;

  totalRoadmaps: number;
  completedRoadmapWeeks: number;

  totalChats: number;

  resumeUploaded: boolean;
  resumeScore: number;
}

interface Props {
  analytics: AnalyticsData;
}

export default function AnalyticsCards({
  analytics,
}: Props) {
  const cards = [
    {
      title: "Resume Score",
      value: `${analytics.resumeScore}/100`,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Average Interview",
      value: `${analytics.averageInterviewScore}/10`,
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Highest Score",
      value: `${analytics.highestInterviewScore}/10`,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Total Interviews",
      value: analytics.totalInterviews,
      icon: Brain,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Roadmaps",
      value: analytics.totalRoadmaps,
      icon: Map,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Completed Weeks",
      value: analytics.completedRoadmapWeeks,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Career Chats",
      value: analytics.totalChats,
      icon: MessageSquare,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      title: "Resume Uploaded",
      value: analytics.resumeUploaded ? "Yes" : "No",
      icon: BarChart3,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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

              <div className={`rounded-full p-4 ${card.bg}`}>
                <Icon className={`h-7 w-7 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}