"use server";

import { createClient } from "@/lib/supabase/server";
import {
  askCareerMentor,
  CareerMentorContext,
} from "@/lib/ai/career-mentor";

export async function sendMessageToCareerMentor(
  message: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  // -----------------------------
  // Profile
  // -----------------------------
  const { data: profile } = await supabase
    .from("profiles")
    .select("target_role")
    .eq("user_id", user.id)
    .maybeSingle();

  // -----------------------------
  // Latest Assessment
  // -----------------------------
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, score")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let strongSkills: string[] = [];
  let weakSkills: string[] = [];

  if (assessment) {
    const { data: assessmentSkills } = await supabase
      .from("assessment_skills")
      .select("rating, role_skill_id")
      .eq("assessment_id", assessment.id);

    if (assessmentSkills && assessmentSkills.length > 0) {
      const ids = assessmentSkills.map(
        (item) => item.role_skill_id
      );

      const { data: roleSkills } = await supabase
        .from("role_skills")
        .select("id, skill_name")
        .in("id", ids);

      const map = new Map(
        roleSkills?.map((s) => [s.id, s.skill_name]) ?? []
      );

      assessmentSkills.forEach((item) => {
        const name = map.get(item.role_skill_id);

        if (!name) return;

        if (item.rating >= 4) {
          strongSkills.push(name);
        }

        if (item.rating <= 2) {
          weakSkills.push(name);
        }
      });
    }
  }

  // -----------------------------
  // Resume Analysis
  // -----------------------------
  const { data: resume } = await supabase
    .from("resume_analysis")
    .select("ats_score, summary")
    .eq("user_id", user.id)
    .maybeSingle();

  // -----------------------------
  // Skill Gap
  // -----------------------------
  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select("missing_skills")
    .eq("user_id", user.id)
    .maybeSingle();

  // -----------------------------
  // Roadmap
  // -----------------------------
  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("generated_plan")
    .eq("user_id", user.id)
    .maybeSingle();

  const context: CareerMentorContext = {
    targetRole: profile?.target_role ?? "Not Selected",

    assessmentScore: assessment?.score ?? 0,

    strongSkills,

    weakSkills,

    missingSkills:
      skillGap?.missing_skills ?? [],

    roadmap:
      roadmap?.generated_plan ?? {},

    atsScore:
      resume?.ats_score ?? 0,

    resumeSummary:
      resume?.summary ?? "",
  };

  const aiResponse = await askCareerMentor(
    message,
    context
  );

  // -----------------------------
  // Save chat history
  // -----------------------------
  await supabase
    .from("career_chat_history")
    .insert({
      user_id: user.id,
      user_message: message,
      ai_response: aiResponse,
    });

  return {
    success: true,
    response: aiResponse,
  };
}