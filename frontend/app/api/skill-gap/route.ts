import { NextResponse } from "next/server";
import { analyzeSkillGap } from "@/lib/ai/skill-gap";
import { saveSkillGapAnalysis } from "@/lib/actions/resume-skill-gap";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data: resumeAnalysis, error: resumeAnalysisError } = await supabase
      .from("resume_analysis")
      .select("extracted_skills")
      .eq("user_id", user.id)
      .maybeSingle();

    if (resumeAnalysisError) {
      return NextResponse.json(
        { success: false, message: resumeAnalysisError.message },
        { status: 500 }
      );
    }

    if (!resumeAnalysis) {
      return NextResponse.json(
        { success: false, message: "Resume not uploaded." },
        { status: 404 }
      );
    }

    let extractedSkills: string[] = [];

    if (Array.isArray(resumeAnalysis?.extracted_skills)) {
      extractedSkills = resumeAnalysis.extracted_skills
        .filter((skill): skill is string => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    if (extractedSkills.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume skills not found. Please analyze your resume.",
        },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("target_role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { success: false, message: profileError.message },
        { status: 500 }
      );
    }

    const targetRole = profile?.target_role?.trim();

    if (!targetRole) {
      return NextResponse.json(
        { success: false, message: "Please select a Career Goal." },
        { status: 400 }
      );
    }

    const { data: careerRole, error: careerRoleError } = await supabase
      .from("career_roles")
      .select("id")
      .eq("role_name", targetRole)
      .maybeSingle();

    if (careerRoleError) {
      return NextResponse.json(
        { success: false, message: careerRoleError.message },
        { status: 500 }
      );
    }

    if (!careerRole) {
      return NextResponse.json(
        { success: false, message: "Career role not found." },
        { status: 404 }
      );
    }

    const { data: roleSkills, error: roleSkillsError } = await supabase
      .from("role_skills")
      .select("skill_name")
      .eq("role_id", careerRole.id);

    if (roleSkillsError) {
      return NextResponse.json(
        { success: false, message: roleSkillsError.message },
        { status: 500 }
      );
    }

    const requiredSkills = (roleSkills ?? [])
      .map((skill) => skill.skill_name)
      .filter((skill): skill is string => Boolean(skill));

    if (requiredSkills.length === 0) {
      return NextResponse.json(
        { success: false, message: "No required skills found for the selected career role." },
        { status: 404 }
      );
    }

    const analysis = await analyzeSkillGap(
      extractedSkills,
      requiredSkills,
      targetRole
    );

    const saveResult = await saveSkillGapAnalysis(targetRole, analysis);

    if (!saveResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: saveResult.message ?? "Failed to save skill gap analysis.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        analysis,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
