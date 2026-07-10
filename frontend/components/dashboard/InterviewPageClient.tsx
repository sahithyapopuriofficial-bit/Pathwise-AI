"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import InterviewHeader from "@/components/dashboard/interview/InterviewHeader";
import ProgressBar from "@/components/dashboard/interview/ProgressBar";
import QuestionCard from "@/components/dashboard/interview/QuestionCard";
import AnswerInput from "@/components/dashboard/interview/AnswerInput";
import NavigationButtons from "@/components/dashboard/interview/NavigationButtons";

interface Question {
  id: string;
  question_no: number;
  question: string;
}

interface InterviewPageClientProps {
  interviewId: string;
  questions: Question[];
}

export default function InterviewPageClient({
  interviewId,
  questions,
}: InterviewPageClientProps) {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];

  const answeredQuestions =
    Object.keys(answers).length;

  function updateAnswer(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  }

  function previousQuestion() {
    if (currentQuestion === 0) return;

    setCurrentQuestion((prev) => prev - 1);
  }

  async function nextQuestion() {
  // Move to next question
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
    return;
  }
  const unanswered = questions.find(
  (q) => !(answers[q.id] ?? "").trim()
);

if (unanswered) {
  alert(
    `Please answer Question ${unanswered.question_no} before submitting.`
  );
  return;
}
  // Finish Interview
  setLoading(true);

  try {
    const response = await fetch(
      "/api/mock-interview/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId,
          answers,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    router.push(
      `/dashboard/mock-interview/${interviewId}/result`
    );
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mx-auto max-w-5xl p-8">

      <InterviewHeader
        currentQuestion={currentQuestion + 1}
        totalQuestions={questions.length}
      />

      <ProgressBar
        currentQuestion={currentQuestion + 1}
        totalQuestions={questions.length}
      />

      <div className="mb-6 flex justify-between text-sm text-slate-500">

        <span>
          Answered {answeredQuestions} of {questions.length}
        </span>

        <span>
          Interview ID:
          <span className="ml-2 font-medium">
            {interviewId.slice(0, 8)}
          </span>
        </span>

      </div>

      <QuestionCard
        questionNo={question.question_no}
        question={question.question}
      />

      <AnswerInput
        value={answers[question.id] ?? ""}
        onChange={updateAnswer}
      />

      <NavigationButtons
        currentQuestion={currentQuestion + 1}
        totalQuestions={questions.length}
        loading={loading}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
      />

    </div>
  );
}