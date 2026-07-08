"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateRoadmap as generateAIRoadmap } from "@/lib/ai/roadmap";

// ==============================
// Generate AI Roadmap
// ==============================

export async function generateRoadmap(
  role: string
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

  // -------------------------------
  // Get latest assessment
  // -------------------------------
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

    if (assessmentSkills && assessmentSkills.length > 0) {
      const weakRoleSkillIds = assessmentSkills
        .filter((item) => item.rating <= 2)
        .map((item) => item.role_skill_id);

      if (weakRoleSkillIds.length > 0) {
        const { data: roleSkills } = await supabase
          .from("role_skills")
          .select("id,skill_name")
          .in("id", weakRoleSkillIds);

        weakSkills =
          roleSkills?.map((skill) => skill.skill_name) ?? [];
      }
    }
  }

  // -------------------------------
  // Resume Skill Gap
  // -------------------------------
  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select("missing_skills")
    .eq("user_id", user.id)
    .maybeSingle();

  const missingSkills =
    skillGap?.missing_skills ?? [];

  // -------------------------------
  // Generate AI Roadmap
  // -------------------------------
  const roadmap = await generateAIRoadmap(
    role,
    weakSkills,
    missingSkills
  );

  // -------------------------------
  // Existing roadmap?
  // -------------------------------
  const { data: existingRoadmap } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let error = null;

  if (existingRoadmap) {
    const { error: updateError } = await supabase
      .from("roadmaps")
      .update({
        generated_plan: roadmap,
        estimated_duration: roadmap.estimated_duration,
        status: "generated",
        created_at: new Date().toISOString(),
      })
      .eq("id", existingRoadmap.id);

    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: user.id,
        generated_plan: roadmap,
        estimated_duration: roadmap.estimated_duration,
        status: "generated",
      });

    error = insertError;
  }

  if (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    roadmap,
  };
}
// ==============================
// Get Latest Roadmap
// ==============================

export async function getLatestRoadmap() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

