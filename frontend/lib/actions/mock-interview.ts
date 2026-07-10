"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateInterviewQuestions,
  MockInterviewContext,
} from "@/lib/ai/mock-interview";

// ==========================================
// Generate Mock Interview
// ==========================================

export async function createMockInterview(
  difficulty: string,
  interviewType: string
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

  // -----------------------------
  // Get Profile
  // -----------------------------

  const { data: profile } = await supabase
    .from("profiles")
    .select("target_role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.target_role) {
    return {
      success: false,
      message: "Please select a Career Goal first.",
    };
  }

  // -----------------------------
  // Get Assessment
  // -----------------------------

  const { data: assessment } = await supabase
    .from("assessments")
    .select("score")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // -----------------------------
  // Get Resume Analysis
  // -----------------------------

  const { data: resume } = await supabase
    .from("resume_analysis")
    .select(
      "summary,strengths,missing_skills"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // -----------------------------
  // Get Skill Gap
  // -----------------------------

  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select(
      "strong_skills,weak_skills"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const context: MockInterviewContext = {
    targetRole: profile.target_role,

    assessmentScore: assessment?.score ?? 0,

    strongSkills:
      skillGap?.strong_skills ?? [],

    weakSkills:
      skillGap?.weak_skills ?? [],

    missingSkills:
      resume?.missing_skills ?? [],

    resumeSummary:
      resume?.summary ??
      "No resume uploaded.",
  };

  // -----------------------------
  // Generate Questions
  // -----------------------------

  const questions =
    await generateInterviewQuestions(
      context,
      difficulty,
      interviewType
    );

  // -----------------------------
  // Create Interview
  // -----------------------------

  const { data: interview, error } =
    await supabase
      .from("mock_interviews")
      .insert({
        user_id: user.id,
        target_role: profile.target_role,
        difficulty,
        interview_type: interviewType,
      })
      .select()
      .single();

  if (error || !interview) {
    return {
      success: false,
      message: error?.message,
    };
  }

  // -----------------------------
  // Save Questions
  // -----------------------------

  const rows = questions.map(
    (question, index) => ({
      interview_id: interview.id,
      question_no: index + 1,
      question: question.question,
    })
  );

  const { error: questionError } =
    await supabase
      .from("mock_interview_questions")
      .insert(rows);

  if (questionError) {
    return {
      success: false,
      message: questionError.message,
    };
  }

  return {
    success: true,
    interviewId: interview.id,
  };
}

// ==========================================
// Get Interview Questions
// ==========================================

export async function getInterviewQuestions(
  interviewId: string
) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("mock_interview_questions")
    .select("*")
    .eq("interview_id", interviewId)
    .order("question_no");

  return data ?? [];
}