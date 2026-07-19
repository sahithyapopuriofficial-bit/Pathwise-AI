import { Award, Sparkles, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface XPProgressProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export default function XPProgress({
  currentXP,
  nextLevelXP,
  level,
}: XPProgressProps) {
  const progress =
    nextLevelXP === 0
      ? 0
      : Math.min(
          Math.round((currentXP / nextLevelXP) * 100),
          100
        );

  const remainingXP = Math.max(
    nextLevelXP - currentXP,
    0
  );

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          XP Progress
        </h2>

        <p className="text-muted-foreground">
          Earn XP by completing tasks, projects and learning milestones.
        </p>

      </div>

      <Card className="overflow-hidden rounded-2xl border">

        <CardHeader>

          <div className="flex items-center justify-between">

            <div>

              <CardTitle className="text-2xl">
                Level {level}
              </CardTitle>

              <p className="mt-2 text-muted-foreground">
                Keep learning to unlock higher levels.
              </p>

            </div>

            <div className="rounded-2xl bg-primary/10 p-4">

              <Award className="h-10 w-10 text-primary" />

            </div>

          </div>

        </CardHeader>

        <CardContent className="space-y-6">

          <div>

            <div className="mb-2 flex justify-between text-sm">

              <span>
                {currentXP} XP
              </span>

              <span>
                {nextLevelXP} XP
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-muted">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-primary/5 p-5">

              <div className="flex items-center gap-3">

                <Sparkles className="h-6 w-6 text-primary" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    Current XP
                  </p>

                  <h3 className="text-xl font-bold">
                    {currentXP}
                  </h3>

                </div>

              </div>

            </div>

            <div className="rounded-xl bg-green-500/5 p-5">

              <div className="flex items-center gap-3">

                <TrendingUp className="h-6 w-6 text-green-600" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    Progress
                  </p>

                  <h3 className="text-xl font-bold">
                    {progress}%
                  </h3>

                </div>

              </div>

            </div>

            <div className="rounded-xl bg-orange-500/5 p-5">

              <div className="flex items-center gap-3">

                <Award className="h-6 w-6 text-orange-500" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    XP Remaining
                  </p>

                  <h3 className="text-xl font-bold">
                    {remainingXP}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

    </section>
  );
}