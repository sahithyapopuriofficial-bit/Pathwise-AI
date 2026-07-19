import {
  ArrowRight,
  Brain,
  Briefcase,
  FileText,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const priorityColors = {
  High: "bg-red-500/10 text-red-600 border-red-500/20",
  Medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Low: "bg-green-500/10 text-green-600 border-green-500/20",
};

function getIcon(category: string) {
  switch (category.toLowerCase()) {
    case "resume":
      return FileText;
    case "career":
      return Briefcase;
    case "ai":
      return Brain;
    default:
      return Sparkles;
  }
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          AI Recommendations
        </h2>

        <p className="text-muted-foreground">
          Personalized suggestions generated based on your roadmap progress.
        </p>

      </div>

      <div className="grid gap-6">

        {recommendations.map((item) => {

          const Icon = getIcon(item.category);

          return (
            <Card
              key={item.id}
              className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <CardHeader>

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">

                      <Icon className="h-6 w-6 text-primary" />

                    </div>

                    <div>

                      <CardTitle className="text-xl">
                        {item.title}
                      </CardTitle>

                      <p className="mt-2 text-muted-foreground">
                        {item.description}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityColors[item.priority]}`}
                  >
                    {item.priority}
                  </span>

                </div>

              </CardHeader>

              <CardContent>

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-muted px-3 py-2 text-sm">
                    {item.category}
                  </span>

                  <Button variant="outline">

                    View Recommendation

                    <ArrowRight className="ml-2 h-4 w-4" />

                  </Button>

                </div>

              </CardContent>

            </Card>
          );

        })}

      </div>

    </section>
  );
}