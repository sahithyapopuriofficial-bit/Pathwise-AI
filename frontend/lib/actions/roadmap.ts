"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  generateRoadmap as generateAIRoadmap,
  normalizeRoadmap,
  type RoadmapResult,
} from "@/lib/ai/roadmap";

export interface RoadmapPageData {
  userName: string;
  targetRole: string;
  currentWeek: number;
  totalWeeks: number;
  completion: number;
  streak: number;
  currentXP: number;
  nextLevelXP: number;
  level: number;
  tasksCompleted: number;
  totalTasks: number;
  skillsCompleted: number;
  totalSkills: number;
  projectsCompleted: number;
  studyHours: number;
  remainingWeeks: number;
  completedWeeks: number;
  averageDailyHours: number;
  timeline: Array<{ id: string; week: number; title: string; description: string; completed: boolean; current: boolean }>;
  weeks: Array<{ id: string; week: number; title: string; description: string; difficulty: string; estimatedHours: number; project: string; skills: string[] }>;
  tasks: Array<{ id: string; title: string; description: string; xp: number; duration: number; completed: boolean }>;
  recommendations: RoadmapResult["recommendations"];
  resources: Array<{ id: string; title: string; description: string; type: "Video" | "Documentation" | "Practice" | "GitHub"; url: string }>;
  milestones: RoadmapResult["milestones"];
}

export type RoadmapDataResult =
  | { status: "ready"; data: RoadmapPageData }
  | { status: "unauthenticated" }
  | { status: "empty" }
  | { status: "error" };

interface ProgressRow {
  week: number;
  completed: boolean | null;
  completed_at: string | null;
}

function resourceType(title: string): "Video" | "Documentation" | "Practice" | "GitHub" {
  const normalized = title.toLowerCase();
  if (normalized.includes("youtube") || normalized.includes("video") || normalized.includes("course")) return "Video";
  if (normalized.includes("github") || normalized.includes("repository")) return "GitHub";
  if (normalized.includes("practice") || normalized.includes("exercise") || normalized.includes("challenge")) return "Practice";
  return "Documentation";
}

function calculateStreak(completedAt: Array<string | null>) {
  const completedDays = new Set(
    completedAt.filter((date): date is string => Boolean(date)).map((date) => date.slice(0, 10)),
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export async function generateRoadmap(role: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "User not authenticated." };

  const { data: latestAssessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let weakSkills: string[] = [];
  if (latestAssessment) {
    const { data: assessmentSkills } = await supabase
      .from("assessment_skills")
      .select("role_skill_id,rating")
      .eq("assessment_id", latestAssessment.id);
    const weakRoleSkillIds = (assessmentSkills ?? [])
      .filter((item) => item.rating <= 2)
      .map((item) => item.role_skill_id);

    if (weakRoleSkillIds.length) {
      const { data: roleSkills } = await supabase
        .from("role_skills")
        .select("skill_name")
        .in("id", weakRoleSkillIds);
      weakSkills = roleSkills?.map((skill) => skill.skill_name) ?? [];
    }
  }

  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select("missing_skills")
    .eq("user_id", user.id)
    .maybeSingle();
  const missingSkills = Array.isArray(skillGap?.missing_skills)
    ? skillGap.missing_skills.filter((skill): skill is string => typeof skill === "string")
    : [];

  let roadmap: RoadmapResult;
  try {
    roadmap = await generateAIRoadmap(role, weakSkills, missingSkills);
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to generate AI roadmap." };
  }

  const { data: existingRoadmap } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  const roadmapValues = {
    generated_plan: roadmap,
    estimated_duration: roadmap.estimated_duration,
    status: "generated",
    created_at: new Date().toISOString(),
  };
  const { error } = existingRoadmap
    ? await supabase.from("roadmaps").update(roadmapValues).eq("id", existingRoadmap.id)
    : await supabase.from("roadmaps").insert({ user_id: user.id, ...roadmapValues });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/learning-roadmap");
  return { success: true, roadmap };
}

export async function getLatestRoadmap() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getRoadmapData(): Promise<RoadmapDataResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "unauthenticated" };

  const [profileResult, roadmapResult] = await Promise.all([
    supabase.from("profiles").select("full_name,target_role").eq("user_id", user.id).maybeSingle(),
    supabase.from("roadmaps").select("id,generated_plan,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (profileResult.error || roadmapResult.error) return { status: "error" };
  if (!roadmapResult.data?.generated_plan) return { status: "empty" };

  let roadmap: RoadmapResult;
  try {
    roadmap = normalizeRoadmap(roadmapResult.data.generated_plan);
  } catch {
    return { status: "error" };
  }

  const { data: progressRows, error: progressError } = await supabase
    .from("roadmap_progress")
    .select("week,completed,completed_at")
    .eq("roadmap_id", roadmapResult.data.id);
  if (progressError) return { status: "error" };

  const progress = (progressRows ?? []) as ProgressRow[];
  const completedWeekNumbers = new Set(progress.filter((row) => row.completed).map((row) => row.week));
  const totalTasks = roadmap.weeks.reduce((total, week) => total + week.tasks.length, 0);
  const taskEntries = roadmap.weeks.flatMap((week) =>
    week.tasks.map((task, index) => ({ ...task, id: `week-${week.week}-task-${index + 1}`, week: week.week })),
  );
  const completedTasks = taskEntries.filter((task) => task.completed || completedWeekNumbers.has(task.week));
  const completedWeeks = roadmap.weeks.filter((week) => completedWeekNumbers.has(week.week)).length;
  const completion = totalTasks
    ? Math.round((completedTasks.length / totalTasks) * 100)
    : Math.round((completedWeeks / roadmap.weeks.length) * 100);
  const completedTaskMinutes = completedTasks.reduce((total, task) => total + task.estimatedMinutes, 0);
  const completedWeeksWithoutTasks = roadmap.weeks.filter((week) => completedWeekNumbers.has(week.week) && !week.tasks.length);
  const studyHours = Math.round((completedTaskMinutes / 60 + completedWeeksWithoutTasks.reduce((total, week) => total + week.estimatedHours, 0)) * 10) / 10;
  const completedSkills = new Set(
    roadmap.weeks.filter((week) => completedWeekNumbers.has(week.week)).flatMap((week) => week.skills),
  ).size;
  const totalSkills = roadmap.statistics.totalSkills || new Set(roadmap.weeks.flatMap((week) => week.skills)).size;
  const projectsCompleted = roadmap.weeks.filter((week) => completedWeekNumbers.has(week.week) && week.project).length;
  const completedXP = completedTasks.reduce((total, task) => total + task.xp, 0);
  const currentXP = Math.max(roadmap.xp.current, completedXP);
  const nextLevelXP = Math.max(roadmap.xp.nextLevel, currentXP + 100);
  const currentWeek = roadmap.weeks.find((week) => !completedWeekNumbers.has(week.week))?.week ?? roadmap.weeks.length;
  const createdAt = roadmapResult.data.created_at ? new Date(roadmapResult.data.created_at) : new Date();
  const activeDays = Math.max(1, Math.ceil((Date.now() - createdAt.getTime()) / 86_400_000) + 1);

  return {
    status: "ready",
    data: {
      userName: profileResult.data?.full_name ?? (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "Learner"),
      targetRole: profileResult.data?.target_role ?? roadmap.title,
      currentWeek,
      totalWeeks: roadmap.weeks.length,
      completion,
      streak: calculateStreak(progress.map((row) => row.completed_at)),
      currentXP,
      nextLevelXP,
      level: roadmap.xp.level,
      tasksCompleted: completedTasks.length,
      totalTasks,
      skillsCompleted: completedSkills,
      totalSkills,
      projectsCompleted,
      studyHours,
      remainingWeeks: Math.max(roadmap.weeks.length - completedWeeks, 0),
      completedWeeks,
      averageDailyHours: Math.round((studyHours / activeDays) * 10) / 10,
      timeline: roadmap.weeks.map((week) => ({ id: `week-${week.week}`, week: week.week, title: week.title, description: `${week.difficulty} · ${week.estimatedHours} hours`, completed: completedWeekNumbers.has(week.week), current: week.week === currentWeek && !completedWeekNumbers.has(week.week) })),
      weeks: roadmap.weeks.map((week) => ({ id: `week-${week.week}`, week: week.week, title: week.title, description: `${week.skills.join(", ") || "Build practical skills"} · ${week.tasks.length} tasks`, difficulty: week.difficulty, estimatedHours: week.estimatedHours, project: week.project, skills: week.skills })),
      tasks: taskEntries.map((task) => ({ id: task.id, title: task.title, description: task.description, xp: task.xp, duration: task.estimatedMinutes, completed: task.completed || completedWeekNumbers.has(task.week) })),
      recommendations: roadmap.recommendations,
      resources: roadmap.weeks.flatMap((week) => week.resources.map((title, index) => ({ id: `week-${week.week}-resource-${index + 1}`, title, description: `Week ${week.week}: ${week.title}`, type: resourceType(title), url: `https://www.google.com/search?q=${encodeURIComponent(title)}` }))),
      milestones: roadmap.milestones.map((milestone, index) => ({ ...milestone, completed: milestone.completed || (roadmap.weeks.length > 0 && completedWeeks >= Math.ceil(((index + 1) / roadmap.milestones.length) * roadmap.weeks.length)) })),
    },
  };
}
