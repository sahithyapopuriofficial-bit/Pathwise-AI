import { redirect } from "next/navigation";

import Header from "@/components/roadmap/Header";
import OverviewCards from "@/components/roadmap/OverviewCards";
import Timeline from "@/components/roadmap/Timeline";
import WeekAccordion from "@/components/roadmap/WeekAccordion";
import TaskList from "@/components/roadmap/TaskList";
import XPProgress from "@/components/roadmap/XPProgress";
import Statistics from "@/components/roadmap/Statistics";
import Recommendations from "@/components/roadmap/Recommendations";
import Resources from "@/components/roadmap/Resources";
import Milestones from "@/components/roadmap/Milestones";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  generateRoadmap,
  getRoadmapData,
} from "@/lib/actions/roadmap";

export default async function LearningRoadmapPage() {
  const result = await getRoadmapData();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }

  if (result.status === "error") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-8">
        <Card className="rounded-3xl p-10 text-center max-w-xl">
          <h2 className="text-2xl font-bold">
            Something went wrong
          </h2>

          <p className="mt-3 text-muted-foreground">
            We couldn't load your learning roadmap.
            Please refresh the page and try again.
          </p>
        </Card>
      </div>
    );
  }

  if (result.status === "empty") {
    return (
      <div className="flex min-h-[75vh] items-center justify-center p-8">
        <Card className="w-full max-w-2xl rounded-3xl p-12 text-center">

          <div className="mb-6 text-6xl">
            🗺️
          </div>

          <h1 className="text-3xl font-bold">
            Generate Your AI Learning Roadmap
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Your personalized roadmap hasn't been generated yet.
            Create one now to receive weekly learning plans,
            projects, milestones, resources and AI recommendations.
          </p>

          <form
            action={async () => {
              "use server";

              await generateRoadmap("AI Engineer");

              redirect("/dashboard/learning-roadmap");
            }}
            className="mt-8"
          >
            <Button size="lg">
              Generate Roadmap
            </Button>
          </form>

        </Card>
      </div>
    );
  }

  const roadmap = result.data;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">

      <Header
        userName={roadmap.userName}
        targetRole={roadmap.targetRole}
        currentWeek={roadmap.currentWeek}
        totalWeeks={roadmap.totalWeeks}
        completion={roadmap.completion}
        streak={roadmap.streak}
        xp={roadmap.currentXP}
      />

      <OverviewCards
        tasksCompleted={roadmap.tasksCompleted}
        totalTasks={roadmap.totalTasks}
        skillsCompleted={roadmap.skillsCompleted}
        totalSkills={roadmap.totalSkills}
        projectsCompleted={roadmap.projectsCompleted}
        studyHours={roadmap.studyHours}
        remainingWeeks={roadmap.remainingWeeks}
      />

      <Timeline
        weeks={roadmap.timeline}
      />

      <WeekAccordion
        weeks={roadmap.weeks}
      />

      <TaskList
        tasks={roadmap.tasks}
      />

      <XPProgress
        currentXP={roadmap.currentXP}
        nextLevelXP={roadmap.nextLevelXP}
        level={roadmap.level}
      />

      <Statistics
        completedWeeks={roadmap.completedWeeks}
        totalWeeks={roadmap.totalWeeks}
        studyHours={roadmap.studyHours}
        skillsCompleted={roadmap.skillsCompleted}
        projectsCompleted={roadmap.projectsCompleted}
        averageDailyHours={roadmap.averageDailyHours}
      />

      <Recommendations
        recommendations={roadmap.recommendations}
      />

      <Resources
        resources={roadmap.resources}
      />

      <Milestones
        milestones={roadmap.milestones}
      />

    </div>
  );
}