"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWeekCompletion } from "@/lib/actions/roadmap-progress";
interface RoadmapProgressButtonProps {
  roadmapId: string;
  week: number;
  completed: boolean;
}
export default function RoadmapProgressButton({
  roadmapId,
  week,
  completed,
}: RoadmapProgressButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    startTransition(async () => {
      const result = await toggleWeekCompletion(
        roadmapId,
        week,
        !completed
      );
      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={completed ? "default" : "outline"}
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      {completed ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Mark Complete
        </>
      )}
    </Button>
  );
}

