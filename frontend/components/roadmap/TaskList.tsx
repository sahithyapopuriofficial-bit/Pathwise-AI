"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  duration: number;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({
  tasks,
}: TaskListProps) {
  const [taskState, setTaskState] = useState(tasks);

  const completedCount = useMemo(
    () => taskState.filter((task) => task.completed).length,
    [taskState]
  );

  const progress =
    taskState.length === 0
      ? 0
      : Math.round((completedCount / taskState.length) * 100);

  function toggleTask(id: string) {
    setTaskState((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  return (
    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Weekly Tasks
          </h2>

          <p className="text-muted-foreground">
            Complete tasks to gain XP and progress through your roadmap.
          </p>

        </div>

        <div className="min-w-[220px]">

          <div className="mb-2 flex justify-between text-sm">

            <span>Progress</span>

            <span>{progress}%</span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">

            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      <div className="space-y-4">

        {taskState.map((task) => (

          <div
            key={task.id}
            className={cn(
              "rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md",

              task.completed &&
                "border-green-500 bg-green-500/5"
            )}
          >

            <div className="flex gap-4">

              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="mt-1"
              >

                {task.completed ? (
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                ) : (
                  <Circle className="h-7 w-7 text-muted-foreground" />
                )}

              </button>

              <div className="flex-1">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <h3
                      className={cn(
                        "text-lg font-semibold",

                        task.completed &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-2 text-muted-foreground">
                      {task.description}
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm">

                      <Star className="h-4 w-4 text-primary" />

                      {task.xp} XP

                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-sm">

                      <Clock3 className="h-4 w-4" />

                      {task.duration} min

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}