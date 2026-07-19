"use client";

import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  FileText,
  Mic,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface NextActionsProps {
  actions: string[];
}

interface RecommendedAction {
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
}

const actionDefinitions: Record<string, RecommendedAction> = {
  "Complete your next roadmap week": {
    title: "Complete your next roadmap week",
    description:
      "Continue your personalized learning roadmap to improve your career readiness.",
    route: "/dashboard/learning-roadmap",
    icon: BookOpen,
  },
  "Take a new mock interview": {
    title: "Take a new mock interview",
    description:
      "Practice interviews regularly to improve confidence and communication skills.",
    route: "/dashboard/mock-interview",
    icon: Mic,
  },
  "Improve your resume ATS score": {
    title: "Improve your resume ATS score",
    description:
      "Optimize your resume so it passes Applicant Tracking Systems successfully.",
    route: "/dashboard/resume-analyzer",
    icon: FileText,
  },
  "Chat with the AI Career Mentor": {
    title: "Chat with the AI Career Mentor",
    description: "Receive personalized career guidance powered by AI.",
    route: "/dashboard/ai-mentor",
    icon: Bot,
  },
};

const fallbackAction: RecommendedAction = {
  title: "Continue your career journey",
  description:
    "Continue improving your career journey with this recommended action.",
  route: "/dashboard",
  icon: ArrowRight,
};

export default function NextActions({
  actions,
}: NextActionsProps) {
  const router = useRouter();
  const recommendedActions = actions.map(
    (title) => actionDefinitions[title] ?? { ...fallbackAction, title },
  );

  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Recommended Next Actions
        </h2>

        <p className="text-muted-foreground">
          AI suggests these actions to maximize your career growth.
        </p>
      </div>

      {actions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">

          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />

          <h3 className="mt-4 text-xl font-semibold">
            Everything Completed 🎉
          </h3>

          <p className="mt-2 text-muted-foreground">
            Great work! Come back after completing more activities.
          </p>

        </div>
      ) : (
        <div className="grid gap-6">

          {recommendedActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <div
                key={`${action.title}-${index}`}
                className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg md:flex-row md:items-center"
              >

                <div className="flex items-start gap-5">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

                    <Icon className="h-7 w-7 text-primary" />

                  </div>

                  <div>

                    <h3 className="text-lg font-semibold">
                      {action.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {action.description}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => router.push(action.route)}
                  aria-label={`Start: ${action.title}`}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 md:mt-0"
                >

                  Start

                  <ArrowRight className="h-4 w-4" />

                </button>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
