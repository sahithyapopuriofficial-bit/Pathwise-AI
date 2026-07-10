interface ScoreCircleProps {
  score: number;
}

export default function ScoreCircle({
  score,
}: ScoreCircleProps) {
  const color =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="flex items-center justify-center">

      <div
        className={`flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-200 text-5xl font-bold ${color}`}
      >
        {score}
      </div>

    </div>
  );
}