import {
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface TimelineWeek {
  id: string;
  week: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface TimelineProps {
  weeks: TimelineWeek[];
}

export default function Timeline({
  weeks,
}: TimelineProps) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Learning Roadmap
        </h2>

        <p className="text-muted-foreground">
          Your personalized AI roadmap from beginner to industry ready.
        </p>

      </div>

      <div className="rounded-2xl border bg-card p-8">

        <div className="space-y-8">

          {weeks.map((week, index) => {

            const isLast = index === weeks.length - 1;

            return (
              <div
                key={week.id}
                className="relative flex gap-6"
              >

                {/* Timeline */}

                <div className="flex flex-col items-center">

                  {week.completed ? (
                    <CheckCircle2
                      className="h-8 w-8 text-green-500"
                    />
                  ) : week.current ? (
                    <PlayCircle
                      className="h-8 w-8 text-primary"
                    />
                  ) : (
                    <Circle
                      className="h-8 w-8 text-muted-foreground"
                    />
                  )}

                  {!isLast && (
                    <div
                      className={cn(
                        "mt-2 w-[2px] flex-1",
                        week.completed
                          ? "bg-green-500"
                          : "bg-border"
                      )}
                      style={{
                        minHeight: "80px",
                      }}
                    />
                  )}

                </div>

                {/* Content */}

                <div
                  className={cn(
                    "flex-1 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",

                    week.completed &&
                      "border-green-500 bg-green-500/5",

                    week.current &&
                      "border-primary bg-primary/5",

                    !week.completed &&
                      !week.current &&
                      "opacity-80"
                  )}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium text-primary">
                        Week {week.week}
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {week.title}
                      </h3>

                    </div>

                    {week.completed && (
                      <span className="rounded-full bg-green-500/10 px-4 py-1 text-xs font-semibold text-green-600">
                        Completed
                      </span>
                    )}

                    {week.current && (
                      <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                        Current
                      </span>
                    )}

                    {!week.completed &&
                      !week.current && (
                        <span className="rounded-full bg-muted px-4 py-1 text-xs">
                          Upcoming
                        </span>
                      )}

                  </div>

                  <p className="mt-4 leading-7 text-muted-foreground">
                    {week.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}