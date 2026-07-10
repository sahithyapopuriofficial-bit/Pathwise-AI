interface QuestionCardProps {
  questionNo: number;
  question: string;
}

export default function QuestionCard({
  questionNo,
  question,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Question {questionNo}
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-700">
        {question}
      </p>
    </div>
  );
}