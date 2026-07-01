"use client";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface SkillGapCardProps {
  score: number;
  strong: string[];
  improving: string[];
  weak: string[];
  nextSkill: string | null;
}

export default function SkillGapCard({
  score,
  strong,
  improving,
  weak,
  nextSkill,
}: SkillGapCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Skill Gap Analysis
      </h2>

      <div className="mt-5">
        <p className="text-sm text-slate-500">
          Overall Readiness
        </p>

        <p className="text-5xl font-bold text-blue-600">
          {score}%
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <section>
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">
              Strong Skills
            </h3>
          </div>

          <ul className="space-y-1 text-sm">
            {strong.length === 0 ? (
              <li className="text-slate-500">
                No strong skills yet.
              </li>
            ) : (
              strong.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))
            )}
          </ul>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">
              Improving Skills
            </h3>
          </div>

          <ul className="space-y-1 text-sm">
            {improving.length === 0 ? (
              <li className="text-slate-500">
                None.
              </li>
            ) : (
              improving.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))
            )}
          </ul>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">
              Needs Improvement
            </h3>
          </div>

          <ul className="space-y-1 text-sm">
            {weak.length === 0 ? (
              <li className="text-slate-500">
                Excellent! No weak skills.
              </li>
            ) : (
              weak.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))
            )}
          </ul>
        </section>

        {nextSkill && (
          <section className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />

              <h3 className="font-semibold">
                Recommended Next Skill
              </h3>
            </div>

            <p className="mt-2 text-lg font-bold text-blue-700">
              {nextSkill}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

