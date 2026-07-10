import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import InterviewResultCard from "@/components/dashboard/interview/InterviewResultCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterviewResultPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // Load interview
  const { data: interview, error } = await supabase
    .from("mock_interviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !interview) {
    notFound();
  }

  // Load all question reviews
  const { data: questionReviews } = await supabase
    .from("mock_interview_questions")
    .select("*")
    .eq("interview_id", id)
    .order("question_no");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <InterviewResultCard
        score={interview.overall_score ?? 0}
        overallFeedback={
          interview.overall_feedback ??
          "Interview completed successfully."
        }
        recommendations={
          interview.recommendations ?? []
        }
        questionReviews={questionReviews ?? []}
      />
    </div>
  );
}