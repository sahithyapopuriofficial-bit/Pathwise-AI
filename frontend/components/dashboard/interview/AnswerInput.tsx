"use client";

import { Textarea } from "@/components/ui/textarea";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function AnswerInput({
  value,
  onChange,
  disabled = false,
}: AnswerInputProps) {
  return (
    <div className="mt-8">
      <label
        htmlFor="interview-answer"
        className="mb-3 block text-lg font-semibold text-slate-800"
      >
        Your Answer
      </label>

      <Textarea
        id="interview-answer"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a detailed answer. The AI will evaluate your explanation, technical accuracy, communication skills, and overall problem-solving approach."
        className="min-h-[220px] resize-none rounded-xl border-slate-300 focus:border-purple-500 focus:ring-purple-500"
      />

      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span>
          Explain your thought process clearly. Detailed answers usually receive
          better AI evaluation.
        </span>

        <span>{value.length} characters</span>
      </div>
    </div>
  );
}