import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  evaluateAnswer,
  generateInterviewSummary,
} from "@/lib/ai/mock-interview";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { interviewId, answers } = body;

    if (!interviewId) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: questions, error } = await supabase
      .from("mock_interview_questions")
      .select("*")
      .eq("interview_id", interviewId)
      .order("question_no");

    if (error || !questions) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found.",
        },
        { status: 404 }
      );
    }

    let totalScore = 0;

    const evaluations: {
      question: string;
      score: number;
      feedback: string;
    }[] = [];

    for (const q of questions) {
      const userAnswer = answers[q.id] ?? "";

      let evaluation;

      try {
        evaluation = await evaluateAnswer(
          q.question,
          userAnswer
        );
      } catch (err) {
        console.error(err);

        evaluation = {
          score: 0,
          feedback: "Unable to evaluate this answer.",
          ideal_answer: "",
        };
      }

      totalScore += evaluation.score;

      evaluations.push({
        question: q.question,
        score: evaluation.score,
        feedback: evaluation.feedback,
      });

      await supabase
        .from("mock_interview_questions")
        .update({
          user_answer: userAnswer,
          ai_feedback: evaluation.feedback,
          score: evaluation.score,
          ideal_answer: evaluation.ideal_answer,
        })
        .eq("id", q.id);
    }

    const overallScore = Math.round(
      totalScore / questions.length
    );

    const summary = await generateInterviewSummary(
      overallScore,
      evaluations
    );

    await supabase
      .from("mock_interviews")
      .update({
        overall_score: overallScore,
        overall_feedback: summary.overall_feedback,
        recommendations: summary.recommendations,
      })
      .eq("id", interviewId);

    return NextResponse.json({
      success: true,
      score: overallScore,
      summary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}