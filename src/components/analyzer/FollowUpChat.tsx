import { useMutation } from "@tanstack/react-query";
import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askAboutReport } from "@/lib/analyzer.functions";
import type { AnalysisResult, ExtractionResult } from "@/lib/report-types";
import { cn } from "@/lib/utils";

const suggestions = [
  "What does this result mean?",
  "Why is this value high?",
  "What foods can I include?",
  "Which doctor should I consult?",
];

type Message = { role: "user" | "assistant"; content: string };

export function FollowUpChat({
  extraction,
  analysis,
}: {
  extraction: ExtractionResult;
  analysis: AnalysisResult | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await askAboutReport({
        data: { question, extraction, analysis, history: messages.slice(-8) },
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.ok) setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
      else setError(res.message);
    },
    onError: () => setError("The assistant is unavailable right now. Please try again shortly."),
  });

  const send = (question: string) => {
    const q = question.trim();
    if (!q || mutation.isPending) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    mutation.mutate(q);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircleQuestion className="size-5 text-primary" aria-hidden />
          Ask about your report
        </CardTitle>
        <CardDescription>
          Questions are answered using only your uploaded report. The assistant cannot diagnose or advise on medication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted-foreground">Start with one of these questions:</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <Button key={s} type="button" variant="outline" size="sm" onClick={() => send(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3" aria-live="polite">
            {messages.map((m, i) => (
              <li
                key={i}
                className={cn(
                  "max-w-[90%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-foreground",
                )}
              >
                {m.content}
              </li>
            ))}
            {mutation.isPending && (
              <li className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Thinking through your report…
              </li>
            )}
          </ul>
        )}

        {error && <p className="rounded-xl bg-danger-soft/70 p-3 text-sm">{error}</p>}

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your report…"
            aria-label="Ask a question about your report"
            disabled={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending || !input.trim()} aria-label="Send question">
            <Send className="size-4" aria-hidden />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
