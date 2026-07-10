import { Brain } from "lucide-react";

interface InterviewHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function InterviewHeader({
  currentQuestion,
  totalQuestions,
}: InterviewHeaderProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="rounded-full bg-purple-100 p-4">
        <Brain className="h-8 w-8 text-purple-600" />
      </div>

      <div>
        <h1 className="text-3xl font-bold">
          AI Mock Interview
        </h1>

        <p className="text-slate-500">
          Question {currentQuestion} of {totalQuestions}
        </p>
      </div>
    </div>
  );
}