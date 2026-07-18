"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const notificationOptions = [
  { id: "career", title: "Career reminders", description: "Stay on track with your career goals." },
  { id: "interview", title: "Interview reminders", description: "Get prepared before scheduled practice sessions." },
  { id: "progress", title: "Weekly progress updates", description: "Receive a weekly summary of your momentum." },
  { id: "recommendations", title: "AI recommendations", description: "Get notified when new personalized guidance is ready." },
] as const;

export default function NotificationCard() {
  const [enabled, setEnabled] = useState<Record<(typeof notificationOptions)[number]["id"], boolean>>({ career: true, interview: true, progress: true, recommendations: true });

  return (
    <Card className="rounded-2xl border-border/80 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BellRing className="size-5" /></div><CardTitle className="mt-3 text-xl">Notifications</CardTitle><CardDescription>Choose which helpful updates you want to receive.</CardDescription></CardHeader>
      <CardContent className="divide-y rounded-xl border">
        {notificationOptions.map((option) => <div key={option.id} className="flex items-center justify-between gap-4 p-4 first:rounded-t-xl last:rounded-b-xl hover:bg-muted/40"><label htmlFor={`notification-${option.id}`} className="cursor-pointer"><p className="font-medium">{option.title}</p><p className="mt-1 text-sm text-muted-foreground">{option.description}</p></label><Switch id={`notification-${option.id}`} checked={enabled[option.id]} onCheckedChange={(checked) => setEnabled((current) => ({ ...current, [option.id]: checked }))} aria-label={option.title} /></div>)}
      </CardContent>
    </Card>
  );
}
