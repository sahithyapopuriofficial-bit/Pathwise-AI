"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generateAndSaveJobRecommendations } from "@/lib/actions/job-recommendations";

export default function GenerateJobRecommendationsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    console.info("[job-recommendations] Generate button clicked");
    startTransition(async () => {
      try {
        const result = await generateAndSaveJobRecommendations();

        if (!result.success) {
          console.error("[job-recommendations] Server action returned an error", result.message);
          toast.error(result.message);
          return;
        }

        console.info("[job-recommendations] Server action completed", {
          count: result.recommendations.length,
        });

        toast.success(
          "AI Job Recommendations generated successfully!"
        );

        router.refresh();
      } catch (error) {
        console.error("Job Recommendation Error:", error);

        toast.error(
          "Something went wrong while generating recommendations."
        );
      }
    });
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending}
      className="gap-2"
      size="lg"
    >
      <Sparkles className="h-4 w-4" />

      {isPending
        ? "Generating Recommendations..."
        : "Generate AI Job Recommendations"}
    </Button>
  );
}
