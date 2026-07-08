"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface SkillGapResult {
  matched_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  match_percentage: number;
  ai_feedback: string;
}

export async function saveSkillGapAnalysis(
  targetRole: string,
  analysis: SkillGapResult
) {
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

  const { data: existing } = await supabase
    .from("skill_gap_analysis")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let error = null;

  if (existing) {
    const { error: updateError } = await supabase
      .from("skill_gap_analysis")
      .update({
        target_role: targetRole,
        matched_skills: analysis.matched_skills,
        missing_skills: analysis.missing_skills,
        recommended_skills: analysis.recommended_skills,
        match_percentage: analysis.match_percentage,
        ai_feedback: analysis.ai_feedback,
        created_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("skill_gap_analysis")
      .insert({
        user_id: user.id,
        target_role: targetRole,
        matched_skills: analysis.matched_skills,
        missing_skills: analysis.missing_skills,
        recommended_skills: analysis.recommended_skills,
        match_percentage: analysis.match_percentage,
        ai_feedback: analysis.ai_feedback,
      });

    error = insertError;
  }

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Skill Gap Analysis saved successfully.",
  };
}

export async function getSkillGapAnalysis() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("skill_gap_analysis")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

export async function getResumeSkillGap() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("skill_gap_analysis")
    .select(
      "match_percentage, matched_skills, missing_skills, recommended_skills, ai_feedback"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    match_percentage: data.match_percentage,
    matched_skills: data.matched_skills,
    missing_skills: data.missing_skills,
    recommended_skills: data.recommended_skills,
    ai_feedback: data.ai_feedback,
  } satisfies SkillGapResult;
}