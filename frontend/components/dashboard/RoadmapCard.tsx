"use client";

import {
  CalendarDays,
  Clock,
  BookOpen,
  CheckCircle2,
  Code2,
  BookMarked,
  FolderGit2,
} from "lucide-react";

import RoadmapProgressButton from "./RoadmapProgressButton";

interface RoadmapWeek {
  week: number;
  title: string;
  skills: string[];
  resources: string[];
  project: string;
}

interface RoadmapData {
  title: string;
  estimated_duration: number;
  weeks: RoadmapWeek[];
}

interface ProgressItem {
  week: number;
  completed: boolean;
}

interface RoadmapCardProps {
  roadmapId: string;
  roadmap: RoadmapData;
  estimatedDuration: number;
  progress: ProgressItem[];
}

export default function RoadmapCard({
  roadmapId,
  roadmap,
  estimatedDuration,
  progress,
}: RoadmapCardProps) {
  if (!roadmap || !roadmap.weeks || roadmap.weeks.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          AI Learning Roadmap
        </h2>

        <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

          <h3 className="mt-4 text-lg font-semibold">
            No Roadmap Available
          </h3>

          <p className="mt-2 text-slate-500">
            Generate your roadmap first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {roadmap.title}
          </h2>

          <p className="text-slate-500">
            AI Generated Learning Roadmap
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
          <Clock className="h-5 w-5 text-blue-600" />

          <span className="font-semibold text-blue-700">
            {estimatedDuration} Weeks
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {roadmap.weeks.map((item) => {
          const completed =
            progress.find((p) => p.week === item.week)
              ?.completed ?? false;

          return (
            <div
              key={item.week}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-bold ${
                    completed
                      ? "bg-green-600"
                      : "bg-blue-600"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    item.week
                  )}
                </div>

                {item.week !== roadmap.weeks.length && (
                  <div className="mt-2 h-12 w-1 rounded bg-blue-200" />
                )}
              </div>

              <div className="flex-1 rounded-xl border bg-slate-50 p-5">
                <div className="flex justify-between">
                  <div className="space-y-4 flex-1">

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold">
                        Week {item.week}
                      </h3>
                    </div>

                    <h4 className="text-xl font-semibold">
                      {item.title}
                    </h4>

                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <Code2 className="h-4 w-4 text-blue-600" />
                        Skills
                      </div>

                      <ul className="mt-2 list-disc pl-6 text-slate-600">
                        {item.skills.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <BookMarked className="h-4 w-4 text-green-600" />
                        Resources
                      </div>

                      <ul className="mt-2 list-disc pl-6 text-slate-600">
                        {item.resources.map((resource) => (
                          <li key={resource}>{resource}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <FolderGit2 className="h-4 w-4 text-purple-600" />
                        Project
                      </div>

                      <p className="mt-2 text-slate-600">
                        {item.project}
                      </p>
                    </div>

                  </div>

                  <RoadmapProgressButton
                    roadmapId={roadmapId}
                    week={item.week}
                    completed={completed}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}