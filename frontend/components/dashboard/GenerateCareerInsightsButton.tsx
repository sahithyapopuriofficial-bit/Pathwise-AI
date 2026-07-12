"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { generateAndSaveCareerInsights } from "@/lib/actions/career-insights";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function GenerateCareerInsightsButton() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const result = await generateAndSaveCareerInsights();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Career insights generated successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to generate career insights:", error);
      toast.error("Unable to generate career insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Insights...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Career Insights
          </>
        )}
      </Button>

      <Toaster richColors />
    </>
  );
}
