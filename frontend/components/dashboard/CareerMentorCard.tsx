"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CareerMentorCard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Career Mentor. I already know your career goal, assessment, resume analysis, skill gaps, and roadmap. Ask me anything about your career!",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/career-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-blue-600" />

          <div>
            <h2 className="text-2xl font-bold">
              AI Career Mentor
            </h2>

            <p className="text-sm text-slate-500">
              Personalized career guidance powered by Gemini
            </p>
          </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto space-y-4 p-6">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
  className={`max-w-[80%] rounded-xl px-4 py-3 ${
    message.role === "user"
      ? "bg-blue-600 text-white"
      : "bg-slate-100 text-slate-800"
  }`}
>
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      a: ({ ...props }) => (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        />
      ),
      code: ({ children }) => (
        <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">
          {children}
        </code>
      ),
    }}
  >
    {message.content}
  </ReactMarkdown>
</div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <div className="border-t p-6">
        <div className="flex gap-3">

          <Textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask anything about your career..."
            className="min-h-[80px]"
          />

          <Button
            onClick={sendMessage}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>

        </div>
      </div>

    </div>
  );
}