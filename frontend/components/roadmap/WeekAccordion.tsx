"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  FolderGit2,
  Layers3,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RoadmapWeek {
  id: string;
  week: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  project: string;
  skills: string[];
}

interface WeekAccordionProps {
  weeks: RoadmapWeek[];
}

export default function WeekAccordion({
  weeks,
}: WeekAccordionProps) {
  const [openWeek, setOpenWeek] = useState<string | null>(
    weeks.length ? weeks[0].id : null
  );

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Weekly Learning Plan
        </h2>

        <p className="text-muted-foreground">
          Explore each week's roadmap, skills, projects and estimated study time.
        </p>

      </div>

      <div className="space-y-5">

        {weeks.map((week) => {

          const open = openWeek === week.id;

          return (
            <div
              key={week.id}
              className="overflow-hidden rounded-2xl border bg-card transition-all"
            >

              <button
                onClick={() =>
                  setOpenWeek(open ? null : week.id)
                }
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/40"
              >

                <div>

                  <p className="text-sm font-medium text-primary">
                    Week {week.week}
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {week.title}
                  </h3>

                  <p className="mt-2 text-muted-foreground">
                    {week.description}
                  </p>

                </div>

                {open ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}

              </button>

              {open && (

                <div className="border-t p-6">

                  <div className="grid gap-6 lg:grid-cols-2">

                    {/* Skills */}

                    <div>

                      <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">

                        <Layers3 className="h-5 w-5 text-primary" />

                        Skills

                      </h4>

                      <div className="flex flex-wrap gap-2">

                        {week.skills.map((skill) => (

                          <span
                            key={skill}
                            className="rounded-full bg-primary/10 px-3 py-2 text-sm"
                          >
                            {skill}
                          </span>

                        ))}

                      </div>

                    </div>

                    {/* Info */}

                    <div className="space-y-4">

                      <div className="flex items-center gap-3">

                        <Clock3 className="h-5 w-5 text-blue-500" />

                        <div>

                          <p className="text-sm text-muted-foreground">
                            Estimated Time
                          </p>

                          <p className="font-semibold">
                            {week.estimatedHours} Hours
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <Star className="h-5 w-5 text-yellow-500" />

                        <div>

                          <p className="text-sm text-muted-foreground">
                            Difficulty
                          </p>

                          <p className="font-semibold">
                            {week.difficulty}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <FolderGit2 className="h-5 w-5 text-green-600" />

                        <div>

                          <p className="text-sm text-muted-foreground">
                            Weekly Project
                          </p>

                          <p className="font-semibold">
                            {week.project}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>
          );

        })}

      </div>

    </section>
  );
}