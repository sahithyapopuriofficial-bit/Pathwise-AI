import {
  Award,
  CheckCircle2,
  Lock,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward: string;
}

interface MilestonesProps {
  milestones: Milestone[];
}

export default function Milestones({
  milestones,
}: MilestonesProps) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Milestones
        </h2>

        <p className="text-muted-foreground">
          Celebrate your achievements and unlock new career milestones.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {milestones.map((milestone) => (

          <Card
            key={milestone.id}
            className={`rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              milestone.completed
                ? "border-green-500 bg-green-500/5"
                : ""
            }`}
          >

            <CardHeader>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div
                    className={`rounded-xl p-3 ${
                      milestone.completed
                        ? "bg-green-500/10"
                        : "bg-muted"
                    }`}
                  >

                    {milestone.completed ? (
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    ) : (
                      <Lock className="h-7 w-7 text-muted-foreground" />
                    )}

                  </div>

                  <div>

                    <CardTitle className="text-lg">
                      {milestone.title}
                    </CardTitle>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {milestone.description}
                    </p>

                  </div>

                </div>

                {milestone.completed && (
                  <Award className="h-6 w-6 text-yellow-500" />
                )}

              </div>

            </CardHeader>

            <CardContent>

              <div className="flex items-center justify-between">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    milestone.completed
                      ? "bg-green-500/10 text-green-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {milestone.completed
                    ? "Unlocked"
                    : "Locked"}
                </span>

                <div className="flex items-center gap-2 text-sm font-medium">

                  <Trophy className="h-4 w-4 text-yellow-500" />

                  {milestone.reward}

                </div>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </section>
  );
}