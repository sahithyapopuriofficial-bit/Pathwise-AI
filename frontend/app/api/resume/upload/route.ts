import { NextRequest, NextResponse } from "next/server";
import * as mammoth from "mammoth";
import { createClient } from "@/lib/supabase/server";
import { analyzeResume } from "@/lib/ai/resume-analysis";
import { saveResume } from "@/lib/actions/resume";
import { saveResumeAnalysis } from "@/lib/actions/resume-analysis";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Invalid file upload." },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const extension = fileName.split(".").pop();

    if (extension !== "pdf" && extension !== "docx") {
      return NextResponse.json(
        { success: false, message: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

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

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storagePath = `${user.id}/${Date.now()}-${file.name}`;
    const contentType =
      file.type ||
      (extension === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, message: uploadError.message },
        { status: 500 }
      );
    }

    const metadataResult = await saveResume(file.name, storagePath);

    if (!metadataResult.success) {
      return NextResponse.json(
        { success: false, message: metadataResult.message ?? "Failed to save resume metadata." },
        { status: 500 }
      );
    }

    let resumeText = "";
    let analysisInput:
      | { kind: "text"; text: string }
      | { kind: "file"; file: Blob; mimeType: string };

    if (extension === "pdf") {
      analysisInput = {
        kind: "file",
        file: new Blob([fileBuffer], { type: contentType }),
        mimeType: contentType,
      };
    } else {
      const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = docxResult.value;
      analysisInput = { kind: "text", text: resumeText };
    }

    const { error: resumeTextError } = await supabase
      .from("resume_analysis")
      .update({ resume_text: resumeText })
      .eq("user_id", user.id);

    if (resumeTextError) {
      return NextResponse.json(
        { success: false, message: resumeTextError.message },
        { status: 500 }
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
        { success: false, message: "Please select Career Goal." },
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

    const analysis = await analyzeResume(analysisInput, targetRole, requiredSkills);

    const analysisResult = await saveResumeAnalysis({
      ats_score: analysis.ats_score,
      strengths: analysis.strengths,
      missing_skills: analysis.missing_skills,
      improvements: analysis.improvements,
      summary: analysis.summary,
    });

    if (!analysisResult.success) {
      return NextResponse.json(
        { success: false, message: analysisResult.message ?? "Failed to analyze resume." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Resume analyzed successfully." },
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
