import Link from "next/link";
import {
  Calendar,
  Briefcase,
  Brain,
  Star,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Interview {
  id: string;
  target_role: string;
  interview_type: string;
  difficulty: string;
  overall_score: number | null;
  created_at: string;
}

interface InterviewHistoryTableProps {
  interviews: Interview[];
}

export default function InterviewHistoryTable({
  interviews,
}: InterviewHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Previous Interviews
        </h2>

        <p className="mt-1 text-slate-500">
          View all your completed AI mock interviews.
        </p>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left">

              <th className="px-6 py-4 font-semibold">
                Date
              </th>

              <th className="px-6 py-4 font-semibold">
                Role
              </th>

              <th className="px-6 py-4 font-semibold">
                Type
              </th>

              <th className="px-6 py-4 font-semibold">
                Difficulty
              </th>

              <th className="px-6 py-4 font-semibold">
                Score
              </th>

              <th className="px-6 py-4 font-semibold">
                Report
              </th>

            </tr>

          </thead>

          <tbody>

            {interviews.map((interview) => (

              <tr
                key={interview.id}
                className="border-t hover:bg-slate-50"
              >

                {/* Date */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Calendar className="h-4 w-4 text-slate-500" />

                    {new Date(
                      interview.created_at
                    ).toLocaleDateString()}

                  </div>

                </td>

                {/* Role */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Briefcase className="h-4 w-4 text-blue-600" />

                    {interview.target_role}

                  </div>

                </td>

                {/* Type */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Brain className="h-4 w-4 text-purple-600" />

                    {interview.interview_type}

                  </div>

                </td>

                {/* Difficulty */}

                <td className="px-6 py-5">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">

                    {interview.difficulty}

                  </span>

                </td>

                {/* Score */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Star className="h-4 w-4 text-yellow-500" />

                    {interview.overall_score ?? "-"}/10

                  </div>

                </td>

                {/* View */}

                <td className="px-6 py-5">

                  <Button
                    asChild
                    size="sm"
                  >

                    <Link
                      href={`/dashboard/mock-interview/${interview.id}/result`}
                    >

                      <Eye className="mr-2 h-4 w-4" />

                      View Report

                    </Link>

                  </Button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}