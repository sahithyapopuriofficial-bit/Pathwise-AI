import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AISummaryCard({ summary }: { summary: string | null | undefined }) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          AI Career Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap leading-7 text-slate-600">
          {summary || "Analyze your resume to receive a personalized AI career summary."}
        </p>
      </CardContent>
    </Card>
  );
}
