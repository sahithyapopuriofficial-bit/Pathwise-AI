"use client";

import { ArrowUpRight, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface CareerReadinessCardProps {
  score: number;
}

export default function CareerReadinessCard({
  score,
}: CareerReadinessCardProps) {
  const router = useRouter();
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(score, 100));
  const progress = circumference - (normalizedScore / 100) * circumference;

  let status = "Beginner";
  let color = "#ef4444";
  let description =
    "Start completing your roadmap and assessments.";

  if (score >= 40) {
    status = "Learning";
    color = "#f59e0b";
    description =
      "You're building a solid foundation. Keep going!";
  }

  if (score >= 60) {
    status = "Job Ready";
    color = "#3b82f6";
    description =
      "Your profile is becoming attractive to recruiters.";
  }

  if (score >= 80) {
    status = "Interview Ready";
    color = "#22c55e";
    description =
      "Excellent progress! You're ready for interviews.";
  }

  return (
    <section className="rounded-3xl border bg-card p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Career Readiness
          </h2>

          <p className="mt-2 text-muted-foreground">
            AI-generated overall readiness score.
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3">
          <Target className="h-6 w-6 text-primary" />
        </div>

      </div>

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Progress Ring */}

        <div className="flex items-center justify-center">

          <div className="relative">

            <svg
              width="220"
              height="220"
              className="-rotate-90"
            >

              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
                fill="transparent"
                className="text-muted"
              />

              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke={color}
                strokeWidth="14"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                style={{
                  transition:
                    "stroke-dashoffset 1s ease",
                }}
              />

            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <span className="text-5xl font-bold">
                {normalizedScore}%
              </span>

              <span className="mt-2 text-muted-foreground">
                Readiness
              </span>

            </div>

          </div>

        </div>

        {/* Details */}

        <div className="flex flex-col justify-center">

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">

            <Sparkles className="h-4 w-4" />

            <span className="font-medium">
              {status}
            </span>

          </div>

          <h3 className="mt-6 text-3xl font-bold">

            {status}

          </h3>

          <p className="mt-4 text-muted-foreground">

            {description}

          </p>

          <div className="mt-8 rounded-2xl border bg-background p-5">

            <h4 className="font-semibold">

              AI Recommendation

            </h4>

            <p className="mt-3 text-sm text-muted-foreground">

              Continue improving your Resume ATS score,
              complete roadmap milestones and regularly
              practice mock interviews to reach 100%
              readiness.

            </p>

          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/career-goals")}
            aria-label="Improve career readiness by visiting career goals"
            className="mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
          >

            Improve Readiness

            <ArrowUpRight className="h-5 w-5" />

          </button>

        </div>

      </div>

    </section>
  );
}
