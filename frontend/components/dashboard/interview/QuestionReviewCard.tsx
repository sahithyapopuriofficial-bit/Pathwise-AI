"use client";

import {
  Brain,
 CheckCircle2,
 MessageSquare,
 BookOpen,
} from "lucide-react";

interface QuestionReviewCardProps {
  questionNo: number;
  question: string;
  userAnswer: string;
  aiFeedback: string;
  idealAnswer: string;
  score: number;
}

export default function QuestionReviewCard({
  questionNo,
  question,
  userAnswer,
  aiFeedback,
  idealAnswer,
  score,
}: QuestionReviewCardProps) {
  function scoreColor() {
    if (score >= 9)
      return "bg-green-100 text-green-700";

    if (score >= 7)
      return "bg-blue-100 text-blue-700";

    if (score >= 5)
      return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Brain className="h-6 w-6 text-purple-600" />

          <h3 className="text-xl font-bold">
            Question {questionNo}
          </h3>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${scoreColor()}`}
        >
          ⭐ {score}/10
        </span>

      </div>

      {/* Question */}

      <div className="mt-6">

        <h4 className="font-semibold text-slate-700">
          Interview Question
        </h4>

        <p className="mt-2 text-slate-800">
          {question}
        </p>

      </div>

      {/* Your Answer */}

      <div className="mt-6 rounded-xl bg-slate-50 p-5">

        <div className="mb-3 flex items-center gap-2">

          <MessageSquare className="h-5 w-5 text-blue-600" />

          <h4 className="font-semibold">
            Your Answer
          </h4>

        </div>

        <p className="whitespace-pre-wrap text-slate-700">
          {userAnswer || "No answer provided."}
        </p>

      </div>

      {/* AI Feedback */}

      <div className="mt-6 rounded-xl bg-green-50 p-5">

        <div className="mb-3 flex items-center gap-2">

          <CheckCircle2 className="h-5 w-5 text-green-600" />

          <h4 className="font-semibold">
            AI Feedback
          </h4>

        </div>

        <p className="whitespace-pre-wrap text-slate-700">
          {aiFeedback}
        </p>

      </div>

      {/* Ideal Answer */}

      <div className="mt-6 rounded-xl bg-yellow-50 p-5">

        <div className="mb-3 flex items-center gap-2">

          <BookOpen className="h-5 w-5 text-yellow-600" />

          <h4 className="font-semibold">
            Ideal Answer
          </h4>

        </div>

        <p className="whitespace-pre-wrap text-slate-700">
          {idealAnswer}
        </p>

      </div>

    </div>
  );
}
