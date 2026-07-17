import { BarChart3, FileText, Map, MessagesSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface CareerStatsProps {
  stats: {
    resumeScore: number;
    assessmentScore: number;
    interviewScore: number;
    roadmapProgress: number;
  };
}

const statItems = [
  { key: "resumeScore", label: "Resume ATS Score", icon: FileText },
  { key: "assessmentScore", label: "Assessment Score", icon: BarChart3 },
  { key: "interviewScore", label: "Interview Score", icon: MessagesSquare },
  { key: "roadmapProgress", label: "Roadmap Progress", icon: Map },
] as const;

export default function CareerStats({ stats }: CareerStatsProps) {
  return (
    <section aria-labelledby="career-statistics-heading">
      <h2 id="career-statistics-heading" className="mb-4 text-xl font-bold text-slate-900">
        Career Statistics
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="bg-white shadow-sm">
            <CardContent className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats[key]}%</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
