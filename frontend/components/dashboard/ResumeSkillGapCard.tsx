"use client";

import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResumeSkillGapAnalysis {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  ai_feedback: string;
}

interface ResumeSkillGapCardProps {
  analysis: ResumeSkillGapAnalysis | null;
}

function getProgressColor(value: number) {
  if (value >= 80) return "bg-green-600";
  if (value >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function getProgressTextColor(value: number) {
  if (value >= 80) return "text-green-700";
  if (value >= 50) return "text-yellow-700";
  return "text-red-700";
}

function getProgressWidthClass(value: number) {
  const rounded = Math.round(value / 5) * 5;

  const widthClasses: Record<number, string> = {
    0: "w-0",
    5: "w-[5%]",
    10: "w-[10%]",
    15: "w-[15%]",
    20: "w-[20%]",
    25: "w-[25%]",
    30: "w-[30%]",
    35: "w-[35%]",
    40: "w-[40%]",
    45: "w-[45%]",
    50: "w-[50%]",
    55: "w-[55%]",
    60: "w-[60%]",
    65: "w-[65%]",
    70: "w-[70%]",
    75: "w-[75%]",
    80: "w-[80%]",
    85: "w-[85%]",
    90: "w-[90%]",
    95: "w-[95%]",
    100: "w-full",
  };

  return widthClasses[rounded] ?? "w-full";
}

export default function ResumeSkillGapCard({
  analysis,
}: ResumeSkillGapCardProps) {
  if (!analysis) {
    return (
      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Resume Skill Gap Analysis
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
            <Brain className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-4 text-lg font-semibold text-slate-700">
              No Skill Gap Analysis found.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Complete your resume analysis first to unlock a personalized skill gap review.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressColor = getProgressColor(analysis.match_percentage);
  const progressTextColor = getProgressTextColor(analysis.match_percentage);
  const progressWidthClass = getProgressWidthClass(analysis.match_percentage);

  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Resume Skill Gap Analysis
        </CardTitle>

        <p className="text-sm text-slate-500">
          Personalized skill gap insights based on your resume and target role.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Match Percentage
              </p>
              <p className={`text-5xl font-bold ${progressTextColor}`}>
                {analysis.match_percentage}%
              </p>
            </div>

            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
              {analysis.match_percentage >= 80
                ? "Excellent Match"
                : analysis.match_percentage >= 50
                  ? "Solid Match"
                  : "Needs Improvement"}
            </div>
          </div>

          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${progressColor} ${progressWidthClass}`} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-green-100 bg-green-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-700">Matched Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.matched_skills.length > 0 ? (
                analysis.matched_skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="border-green-200 bg-green-100 text-green-700"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-green-700/80">No matched skills yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-700">Missing Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.missing_skills.length > 0 ? (
                analysis.missing_skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="border-red-200 bg-red-100 text-red-700"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-red-700/80">No missing skills identified.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-700">Recommended Skills</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.recommended_skills.length > 0 ? (
              analysis.recommended_skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="border-blue-200 bg-blue-100 text-blue-700"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-blue-700/80">No recommendations yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-slate-900">AI Feedback</h3>
          </div>

          <p className="leading-7 text-slate-600">{analysis.ai_feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
}