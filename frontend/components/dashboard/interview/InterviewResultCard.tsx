"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Lightbulb,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionReview {
  id: string;
  question_no: number;
  question: string;
  user_answer: string;
  ai_feedback: string;
  ideal_answer: string;
  score: number;
}

interface InterviewResultCardProps {
  score: number;
  overallFeedback?: string;
  recommendations?: string[];
  questionReviews?: QuestionReview[];
}

type Performance = {
  label: "Excellent" | "Good" | "Average" | "Needs Improvement";
  badgeClassName: string;
  accentClassName: string;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(10, Number.isFinite(score) ? score : 0));
}

function getPerformance(score: number): Performance {
  if (score >= 9) {
    return {
      label: "Excellent",
      badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      accentClassName: "text-emerald-600",
    };
  }

  if (score >= 7) {
    return {
      label: "Good",
      badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
      accentClassName: "text-sky-600",
    };
  }

  if (score >= 5) {
    return {
      label: "Average",
      badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
      accentClassName: "text-amber-600",
    };
  }

  return {
    label: "Needs Improvement",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
    accentClassName: "text-rose-600",
  };
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-normal text-slate-950 sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const normalizedScore = clampScore(score);
  const performance = getPerformance(normalizedScore);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold",
        performance.badgeClassName
      )}
    >
      <Star className="size-4 fill-current" aria-hidden="true" />
      {normalizedScore}/10
    </span>
  );
}

function QuestionReviewItem({ review }: { review: QuestionReview }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <MessageSquareText className="size-5" aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Question {review.question_no}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-7 text-slate-950 sm:text-lg">
              {review.question}
            </h3>
          </div>
        </div>

        <ScoreBadge score={review.score} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MessageSquareText className="size-4 text-sky-600" aria-hidden="true" />
            User Answer
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {review.user_answer || "No answer was submitted for this question."}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            AI Feedback
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {review.ai_feedback}
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BookOpenCheck className="size-4 text-amber-600" aria-hidden="true" />
            Ideal Answer
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {review.ideal_answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function InterviewResultCard({
  score,
  overallFeedback = "",
  recommendations = [],
  questionReviews = [],
}: InterviewResultCardProps) {
  const normalizedScore = clampScore(score);
  const performance = getPerformance(normalizedScore);
  const scorePercent = normalizedScore * 10;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Trophy className="size-6 text-amber-300" aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300">
                  Mock Interview Result
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">
                  Interview Completed
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold",
                  performance.badgeClassName
                )}
              >
                <Award className="size-4" aria-hidden="true" />
                {performance.label}
              </div>

              <div className="rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/15">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold leading-none">
                    {normalizedScore}
                  </span>
                  <span className="pb-1 text-sm font-medium text-slate-300">
                    /10
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Overall Score
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Performance</span>
              <span>{scorePercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-amber-300 transition-all duration-500"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={Sparkles}
          title="AI Performance Summary"
          description="A concise overview of your interview performance."
        />
        <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
          {overallFeedback || "No overall feedback was returned for this interview."}
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={Lightbulb}
          title="Personalized Recommendations"
          description="Focused next steps based on this interview result."
        />

        {recommendations.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {recommendations.map((recommendation, index) => (
              <li
                key={`${recommendation}-${index}`}
                className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <Target
                  className={cn("mt-0.5 size-5 shrink-0", performance.accentClassName)}
                  aria-hidden="true"
                />
                <span className="text-sm leading-6 text-slate-700">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Recommendations were not returned for this interview.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={MessageSquareText}
            title="Question Review"
            description="Detailed feedback for each interview question."
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700">
              <MessageSquareText className="size-4" aria-hidden="true" />
              {questionReviews.length} Questions
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700">
              <Star className="size-4" aria-hidden="true" />
              {performance.label}
            </span>
          </div>
        </div>

        {questionReviews.length > 0 ? (
          questionReviews.map((review) => (
            <QuestionReviewItem key={review.id} review={review} />
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm sm:p-6">
            Question reviews were not returned for this interview.
          </div>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild className="h-10">
          <Link href="/dashboard">
            <RotateCcw className="size-4" aria-hidden="true" />
            Retake Interview
          </Link>
        </Button>

        <Button asChild className="h-10">
          <Link href="/dashboard">
            Back to Dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
