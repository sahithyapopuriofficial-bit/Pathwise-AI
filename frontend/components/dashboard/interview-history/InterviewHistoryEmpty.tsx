import Link from "next/link";
import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function InterviewHistoryEmpty() {
  return (
    <div className="rounded-2xl border border-dashed bg-white p-12 text-center">

      <FileSearch className="mx-auto h-14 w-14 text-slate-400" />

      <h2 className="mt-6 text-2xl font-bold">
        No Interview History
      </h2>

      <p className="mt-2 text-slate-500">
        You haven't completed any AI mock interviews yet.
      </p>

      <Button
        className="mt-8"
        asChild
      >
        <Link href="/dashboard">
          Start Your First Interview
        </Link>
      </Button>

    </div>
  );
}