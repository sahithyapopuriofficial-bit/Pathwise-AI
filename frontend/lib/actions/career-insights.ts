"use server";

import { revalidatePath } from "next/cache";

import {
  generateCareerInsights,
  type CareerInsightsInput,
  type CareerInsightsOutput,
} from "@/lib/ai/career-insights";
import { createClient } from "@/lib/supabase/server";

export interface CareerInsights extends CareerInsightsOutput {
  user_id: string;
}

export type GenerateCareerInsightsResult =
  | {
      success: true;
      insights: CareerInsights;
    }
  | {
      success: false;
      message: string;
    };

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string"
  );
}

function toScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

export async function generateAndSaveCareerInsights(): Promise<GenerateCareerInsightsResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
    };
  }

  const [
    profileResult,
    assessmentResult,
    interviewResult,
    resumeResult,
    roadmapResult,
    skillGapResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_role")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("assessments")
      .select("score")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("mock_interviews")
      .select("overall_score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("resume_analysis")
      .select("ats_score, ai_summary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("roadmaps")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("skill_gap_analysis")
      .select("matched_skills, recommended_skills, missing_skills")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const roadmapProgressResult = roadmapResult.data
    ? await supabase
        .from("roadmap_progress")
        .select("completed")
        .eq("roadmap_id", roadmapResult.data.id)
    : { data: [] as { completed: boolean | null }[] };

  const roadmapProgress = roadmapProgressResult.data ?? [];

  const completedWeeks = roadmapProgress.filter(
    (week) => week.completed === true
  ).length;

  const input: CareerInsightsInput = {
    targetRole: profileResult.data?.target_role ?? "Not Selected",
    assessmentScore: toScore(assessmentResult.data?.score),
    interviewScore: toScore(interviewResult.data?.overall_score),
    resumeScore: toScore(resumeResult.data?.ats_score),
    roadmapProgress:
      roadmapProgress.length > 0
        ? Math.round(
            (completedWeeks / roadmapProgress.length) * 100
          )
        : 0,
    strongSkills: toStringArray(
      skillGapResult.data?.matched_skills
    ),
    weakSkills: toStringArray(
      skillGapResult.data?.recommended_skills
    ),
    missingSkills: toStringArray(
      skillGapResult.data?.missing_skills
    ),
    resumeSummary: resumeResult.data?.ai_summary ?? "",
  };

  let generatedInsights: CareerInsightsOutput;

  try {
    generatedInsights =
      await generateCareerInsights(input);
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Unable to generate career insights.",
    };
  }

  const { data, error } = await supabase
    .from("career_insights")
    .upsert(
      {
        user_id: user.id,
        readiness_score:
          generatedInsights.readiness_score,
        strengths: generatedInsights.strengths,
        weaknesses: generatedInsights.weaknesses,
        next_steps: generatedInsights.next_steps,
        ai_summary: generatedInsights.summary,
      },
      {
        onConflict: "user_id",
      }
    )
    .select(
      `
      user_id,
      readiness_score,
      strengths,
      weaknesses,
      next_steps,
      ai_summary
    `
    )
    .single();

  if (error || !data) {
    return {
      success: false,
      message:
        error?.message ??
        "Unable to save career insights.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    insights: {
      user_id: data.user_id,
      readiness_score: data.readiness_score,
      strengths: data.strengths ?? [],
      weaknesses: data.weaknesses ?? [],
      next_steps: data.next_steps ?? [],
      summary: data.ai_summary ?? "",
    },
  };
}

export async function getLatestCareerInsights(): Promise<CareerInsights | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("career_insights")
    .select(
      `
      user_id,
      readiness_score,
      strengths,
      weaknesses,
      next_steps,
      ai_summary
    `
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    user_id: data.user_id,
    readiness_score: data.readiness_score,
    strengths: data.strengths ?? [],
    weaknesses: data.weaknesses ?? [],
    next_steps: data.next_steps ?? [],
    summary: data.ai_summary ?? "",
  };
}

/** @deprecated */
export async function createCareerInsights() {
  return generateAndSaveCareerInsights();
}
