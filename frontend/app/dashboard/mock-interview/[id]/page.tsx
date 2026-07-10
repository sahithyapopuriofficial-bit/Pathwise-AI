import { getInterviewQuestions } from "@/lib/actions/mock-interview";
import InterviewPageClient from "@/components/dashboard/InterviewPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterviewPage({
  params,
}: PageProps) {
  const { id } = await params;

  const questions = await getInterviewQuestions(id);

  return (
    <InterviewPageClient
      interviewId={id}
      questions={questions}
    />
  );
}