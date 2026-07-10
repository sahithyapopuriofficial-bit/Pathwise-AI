import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentQuestion: number;
  totalQuestions: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function NavigationButtons({
  currentQuestion,
  totalQuestions,
  loading,
  onPrevious,
  onNext,
}: NavigationButtonsProps) {
  const isLastQuestion =
    currentQuestion === totalQuestions;

  return (
    <div className="mt-10 flex justify-between">

      <Button
        variant="outline"
        disabled={currentQuestion === 1 || loading}
        onClick={onPrevious}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button
        disabled={loading}
        onClick={onNext}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isLastQuestion ? (
          "Finish Interview"
        ) : (
          <>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

    </div>
  );
}