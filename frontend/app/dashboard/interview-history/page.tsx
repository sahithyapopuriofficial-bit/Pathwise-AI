import { getInterviewHistory, getInterviewStats } from "@/lib/actions/interview-history";

import InterviewHistoryStats from "@/components/dashboard/interview-history/InterviewHistoryStats";
import InterviewHistoryTable from "@/components/dashboard/interview-history/InterviewHistoryTable";
import InterviewHistoryEmpty from "@/components/dashboard/interview-history/InterviewHistoryEmpty";

export default async function InterviewHistoryPage() {
  const interviews = await getInterviewHistory();

  const stats = await getInterviewStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Page Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Interview History
        </h1>

        <p className="mt-2 text-slate-500">
          Review all your previous AI mock interviews and track your progress.
        </p>

      </div>

      {/* Statistics */}

      <InterviewHistoryStats stats={stats} />

      {/* Table / Empty */}

      <div className="mt-10">

        {interviews.length === 0 ? (
          <InterviewHistoryEmpty />
        ) : (
          <InterviewHistoryTable interviews={interviews} />
        )}

      </div>

    </div>
  );
}