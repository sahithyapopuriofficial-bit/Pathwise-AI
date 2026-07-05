"use client";

import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
} from "lucide-react";

interface ResumeAnalysis {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  ai_summary: string;
}

interface ResumeAnalyzerCardProps {
  analysis: ResumeAnalysis | null;
}

export default function ResumeAnalyzerCard({
  analysis,
}: ResumeAnalyzerCardProps) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">
            AI Resume Analyzer
          </h2>
        </div>

        <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />

          <h3 className="mt-4 text-lg font-semibold">
            No Resume Analysis Yet
          </h3>

          <p className="mt-2 text-slate-500">
            Upload your resume to receive an AI-powered ATS
            score and personalized suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            AI Resume Analyzer
          </h2>

          <p className="text-slate-500">
            AI-powered resume evaluation
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 px-6 py-4 text-center">
          <p className="text-sm text-slate-500">
            ATS Score
          </p>

          <h2 className="text-4xl font-bold text-blue-600">
            {analysis.ats_score}%
          </h2>
        </div>
      </div>

      {/* Progress Bar */}

      <div className="mt-6">
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{
              width: `${analysis.ats_score}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Strengths */}

        <div className="rounded-xl bg-green-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />

            <h3 className="font-bold text-green-700">
              Strengths
            </h3>
          </div>

          <ul className="space-y-2">
            {analysis.strengths.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />

                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills */}

        <div className="rounded-xl bg-red-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />

            <h3 className="font-bold text-red-700">
              Missing Skills
            </h3>
          </div>

          <ul className="space-y-2">
            {analysis.missing_skills.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-red-600" />

                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvements */}

      <div className="mt-8 rounded-xl bg-yellow-50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-600" />

          <h3 className="font-bold text-yellow-700">
            Suggestions for Improvement
          </h3>
        </div>

        <ul className="space-y-3">
          {analysis.improvements.map((item) => (
            <li
              key={item}
              className="rounded-lg bg-white p-3 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Summary */}

      <div className="mt-8 rounded-xl bg-slate-50 p-6">
        <h3 className="mb-3 font-bold">
          AI Career Summary
        </h3>

        <p className="leading-7 text-slate-600">
          {analysis.ai_summary}
        </p>
      </div>
    </div>
  );
}