interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function ProgressBar({
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  const progress =
    (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between">
        <span className="font-medium">
          Progress
        </span>

        <span className="text-sm text-slate-500">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-3 rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-purple-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}