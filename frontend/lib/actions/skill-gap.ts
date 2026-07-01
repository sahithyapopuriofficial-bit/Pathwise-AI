"use server";

import { createClient } from "@/lib/supabase/server";

export interface SkillGapResult {
  score: number;
  strong: string[];
  improving: string[];
  weak: string[];
  nextSkill: string | null;
}

export async function getSkillGap(): Promise<SkillGapResult | null> {
  const supabase = await createClient();

  // Get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get latest assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (assessmentError || !assessment) {
    return null;
  }

  // Load all rated skills
  const { data: assessmentSkills, error: skillsError } = await supabase
    .from("assessment_skills")
    .select("rating, role_skill_id")
    .eq("assessment_id", assessment.id);

  if (skillsError || !assessmentSkills) {
    return null;
  }

  // Get skill names
  const roleSkillIds = assessmentSkills.map(
    (skill) => skill.role_skill_id
  );

  const { data: roleSkills, error: roleSkillsError } = await supabase
    .from("role_skills")
    .select("id, skill_name")
    .in("id", roleSkillIds);

  if (roleSkillsError || !roleSkills) {
    return null;
  }

  const skillMap = new Map(
    roleSkills.map((skill) => [skill.id, skill.skill_name])
  );

  const strong: string[] = [];
  const improving: string[] = [];
  const weak: string[] = [];

  assessmentSkills.forEach((item) => {
    const skillName =
      skillMap.get(item.role_skill_id) ?? "Unknown Skill";

    if (item.rating >= 4) {
      strong.push(skillName);
    } else if (item.rating === 3) {
      improving.push(skillName);
    } else {
      weak.push(skillName);
    }
  });

  return {
    score: assessment.score,
    strong,
    improving,
    weak,
    nextSkill: weak.length > 0 ? weak[0] : null,
  };
}

